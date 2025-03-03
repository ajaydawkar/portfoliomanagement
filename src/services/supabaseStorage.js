import { supabase, supabaseStorageBucket } from "../config/supabase.js";

export class SupabaseStorageService {
  constructor(bucketName = supabaseStorageBucket) {
    this.bucket = bucketName;
    // Initialize bucket when service is created
    this.initBucket().catch(console.error);
  }

  async initBucket() {
    try {
      // First check if bucket exists
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) throw listError;

      const bucketExists = buckets?.some((b) => b.name === this.bucket);

      if (!bucketExists) {
        // Create bucket with correct settings
        const { error: createError } = await supabase.storage.createBucket(
          this.bucket,
          {
            public: true, // Make bucket public
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ["image/*"],
          }
        );

        if (createError) throw createError;

        // Create policies for the bucket
        const { error: policyError } = await supabase.rpc(
          "create_storage_policy",
          {
            bucket_name: this.bucket,
            policy_definition: {
              role: "authenticated",
              actions: ["SELECT", "INSERT", "UPDATE", "DELETE"],
            },
          }
        );

        if (policyError) console.error("Policy error:", policyError);
      }

      return true;
    } catch (error) {
      console.error("Error initializing bucket:", error);
      throw error;
    }
  }

  async getSignedUrl(path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  }

  async listFiles(folder = "") {
    try {
      // List all files recursively to get files from all folders
      const { data: allFiles, error } = await supabase.storage
        .from(this.bucket)
        .list(folder, {
          sortBy: { column: "name", order: "asc" },
          limit: 100,
        });

      if (error) throw error;

      // Process files and folders
      const items = allFiles || [];
      const folders = new Set();
      const files = [];

      // Process each item
      for (const item of items) {
        if (item.name.includes("/")) {
          // It's in a subfolder
          const folderName = item.name.split("/")[0];
          folders.add(folderName);
        } else if (!item.metadata?.mimetype) {
          // It's a folder
          folders.add(item.name);
        } else {
          // It's a file
          files.push({
            id: item.id || Date.now(),
            name: item.name,
            size: item.metadata?.size || 0,
            contentType: item.metadata?.mimetype || "application/octet-stream",
            uploadTime: item.created_at || new Date().toISOString(),
            url: this.getPublicUrl(
              folder ? `${folder}/${item.name}` : item.name
            ),
            folder: folder || "root",
            path: folder ? `${folder}/${item.name}` : item.name,
          });
        }
      }

      // Get files from subfolders
      for (const subFolder of folders) {
        const { files: subFiles } = await this.listFiles(
          `${folder}${folder ? "/" : ""}${subFolder}`
        );
        files.push(...subFiles);
      }

      return {
        folders: Array.from(folders),
        files,
      };
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  async listFolders() {
    try {
      const { data, error } = await supabase.storage.from(this.bucket).list();

      if (error) throw error;

      // Extract unique folders from file paths
      const folders = new Set();
      data.forEach((item) => {
        if (item.name.includes("/")) {
          const folder = item.name.split("/")[0];
          folders.add(folder);
        }
      });

      return Array.from(folders);
    } catch (error) {
      console.error("Error listing folders:", error);
      throw error;
    }
  }

  async uploadFile(file, filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      return {
        data,
        publicUrl: this.getPublicUrl(filePath),
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  async createFolder(folderName, parentFolder = "") {
    try {
      const path = parentFolder
        ? `${parentFolder}/${folderName}/.keep`
        : `${folderName}/.keep`;
      const emptyFile = new Blob([""], { type: "text/plain" });

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(path, emptyFile, {
          upsert: false,
          metadata: {
            isFolder: true,
          },
        });

      if (error) throw error;
      return folderName;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  }

  getPublicUrl(path) {
    try {
      const { data } = supabase.storage.from(this.bucket).getPublicUrl(path);

      // Ensure the URL is properly formatted
      if (!data?.publicUrl) {
        throw new Error("Failed to generate public URL");
      }

      // Add the required headers for public access
      const url = new URL(data.publicUrl);
      return url.toString();
    } catch (error) {
      console.error("Error getting public URL:", error);
      return null; // Return null for invalid URLs
    }
  }
}
