import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

// Add all required icons
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  FileCopy as FileCopyIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
// import { storage as configuredStorage } from "../../config/firebase";
import {
  ref,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  uploadBytes,
} from "firebase/storage";
import { Toaster, toast } from "react-hot-toast";

// Add these imports at the top
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Add import
import { useScrollLock } from "../../hooks/useScrollLock";

// Add import
// import { google } from "googleapis";

// Add import
import { SupabaseStorageService } from "../../services/supabaseStorage";

// Create styled components
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(241, 245, 249, 0.2);
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 8%) 0px 20px 40px, rgb(0 0 0 / 6%) 0px 1px 3px;
    overflow: hidden;
  }
`;

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  padding: "24px",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
  },
}));

// Copy the styles object from ImageUploadForm
const styles = {
  // Main container and header styles
  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: 4,
    borderRadius: "16px 16px 0 0",
  },
  headerText: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    fontSize: { xs: "1.75rem", sm: "2rem" },
  },

  // Stats section styles
  statsContainer: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: 3,
    mb: 4,
  },
  statCard: {
    p: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    },
  },
  statValue: {
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
    fontWeight: 600,
    color: "#0F172A",
    mt: 1,
  },
  statLabel: {
    color: "#64748B",
    fontSize: "0.875rem",
  },

  // Folder grid styles
  folderGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(auto-fill, minmax(200px, 1fr))",
      sm: "repeat(auto-fill, minmax(250px, 1fr))",
    },
    gap: 3,
    mb: 4,
  },
  folderCard: {
    p: 3,
    borderRadius: 2,
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    transition: "all 0.2s ease",
    border: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
    "&:hover": {
      backgroundColor: "#F8FAFC",
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 2,
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
    transition: "all 0.2s ease",
    "& svg": {
      fontSize: 28,
      color: "#64748B",
    },
  },
  folderName: {
    fontWeight: 600,
    color: "#1E293B",
    fontSize: "0.925rem",
  },
  folderStats: {
    mt: 2,
    pt: 2,
    borderTop: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Table styles
  tableContainer: {
    mt: 4,
    borderRadius: 2,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    overflow: "auto",
    width: "100%",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    "& .MuiTable-root": {
      minWidth: "100%",
    },
    "&::-webkit-scrollbar": {
      height: 8,
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#F1F5F9",
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#CBD5E1",
      borderRadius: 4,
      "&:hover": {
        backgroundColor: "#94A3B8",
      },
    },
  },
  tableHeader: {
    backgroundColor: "#F8FAFC",
    "& th": {
      borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
    },
  },
  tableHeaderCell: {
    color: "#64748B",
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    py: 2,
    px: 3,
    transition: "all 0.2s ease",
  },
  tableRow: {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#F1F5F9",
    },
    "& td": {
      borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
      py: 2,
      px: 3,
    },
  },

  // Dialog styles
  dialogTitle: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2,
  },
  dialogContent: {
    p: 3,
  },
  dialogActions: {
    px: 3,
    py: 2,
    borderTop: "1px solid",
    borderColor: "rgba(100, 116, 139, 0.12)",
  },

  // Button styles
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  uploadButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
    },
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
  },

  // Add these styles to your styles object
  dialogHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2,
  },
  dialogHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogCloseButton: {
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
    },
  },

  // Update the styles object
  dialogHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2.5,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    },
  },

  dialogContent: {
    p: 4,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  },

  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(239,68,68,0.2)",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(239,68,68,0.3)",
    },
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease-in-out",
  },
};

const dialogStyles = {
  uploadArea: {
    border: "2px dashed #CBD5E1",
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#F8FAFC",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minHeight: "240px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      borderColor: "#0F172A",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
    },
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: "16px",
    backgroundColor: "#E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
    transition: "all 0.2s ease",
    "& svg": {
      fontSize: 32,
      color: "#64748B",
      transition: "all 0.2s ease",
    },
    "&:hover": {
      backgroundColor: "#CBD5E1",
      "& svg": {
        color: "#1E293B",
        transform: "scale(1.1)",
      },
    },
  },
  supportedFormats: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  formatChip: {
    padding: "4px 12px",
    borderRadius: "12px",
    backgroundColor: "#F1F5F9",
    fontSize: "0.75rem",
    color: "#64748B",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  uploadArea: {
    border: "2px dashed #CBD5E1",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#F8FAFC",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
    },
  },
  fileInfo: {
    mt: 2,
    p: 2,
    borderRadius: "8px",
    backgroundColor: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  folderInput: {
    border: "2px solid #E2E8F0",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#F8FAFC",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#94A3B8",
      backgroundColor: "#F1F5F9",
    },
  },
};

// Update the toast configuration
const toastConfig = {
  position: "top-center",
  duration: 3000,
  style: {
    background: "rgba(15, 23, 42, 0.95)",
    color: "white",
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    padding: "16px 24px",
    maxWidth: "500px",
    width: "90%",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  success: {
    style: {
      background: "rgba(16, 185, 129, 0.95)",
    },
    icon: (
      <SuccessIcon
        sx={{
          animation: "rotate 0.5s ease-out",
          "@keyframes rotate": {
            "0%": { transform: "scale(0.5) rotate(-180deg)" },
            "100%": { transform: "scale(1) rotate(0)" },
          },
        }}
      />
    ),
  },
  error: {
    style: {
      background: "rgba(239, 68, 68, 0.95)",
    },
    icon: (
      <ErrorIcon
        sx={{
          animation: "shake 0.5s ease-in-out",
          "@keyframes shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "25%": { transform: "translateX(-4px)" },
            "75%": { transform: "translateX(4px)" },
          },
        }}
      />
    ),
  },
  loading: {
    style: {
      background: "rgba(30, 41, 59, 0.95)",
    },
    icon: (
      <LoadingIcon
        sx={{
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    ),
    duration: Infinity,
  },
  info: {
    style: {
      background: "rgba(59, 130, 246, 0.95)",
    },
    icon: <InfoIcon sx={{ animation: "fadeIn 0.5s ease-in" }} />,
  },
};

// First, add a common toast message component
const ToastMessage = ({ message, description }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Typography sx={{ fontWeight: 500 }}>{message}</Typography>
    {description && (
      <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
        {description}
      </Typography>
    )}
  </Box>
);

// Single enhanced showToast function
const showToast = (message, type = "success") => {
  // Dismiss all existing toasts
  toast.dismiss();

  // Handle different message formats
  const toastMessage =
    typeof message === "string" ? (
      <ToastMessage message={message} />
    ) : (
      <ToastMessage
        message={message.title || message.message}
        description={message.description}
      />
    );

  // Return the toast ID for reference
  return toast[type](toastMessage, {
    ...toastConfig,
    duration: type === "loading" ? Infinity : 3000,
  });
};

const StorageForm = () => {
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();

  // Copy the state and functions related to bucket images from ImageUploadForm
  const [bucketImages, setBucketImages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState(["root"]);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("root");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Add new state variables
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Replace the existing storage initialization
  const storageService = new SupabaseStorageService();

  // Update fetchBucketImages function
  const fetchBucketImages = async () => {
    try {
      const { folders: newFolders, files } = await storageService.listFiles(
        currentFolder === "root" ? "" : currentFolder
      );

      if (!files) {
        throw new Error("Unable to fetch files");
      }

      // Filter out any null or undefined folders
      const validFolders = ["root", ...newFolders].filter(Boolean);

      // Filter out any duplicate folders
      const uniqueFolders = [...new Set(validFolders)];

      setFolders(uniqueFolders);
      setBucketImages(files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast(
        {
          title: "Failed to fetch files",
          description: error.message,
        },
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading("Loading storage data...");
      try {
        await fetchBucketImages();
        toast.dismiss(loadingToast);
        toast.success("Storage data loaded successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error in useEffect:", error);
        toast.error("Failed to load storage data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeStorage = async () => {
      const toastId = showToast({
        title: "Initializing storage...",
        description: "Setting up your storage bucket",
      });

      try {
        // Ensure user is authenticated before initialization
        const session = await storageService.getSession();
        if (!session) {
          throw new Error("Please sign in to access storage");
        }

        // Initialize with RLS policies
        await storageService.initBucket({
          public: false, // Make bucket private
          allowedUsers: [session.user.id], // Allow only current user
        });

        await fetchBucketImages();

        toast.success(
          <ToastMessage
            message="Storage ready"
            description="Your storage has been initialized"
          />,
          { ...toastConfig, id: toastId }
        );
      } catch (error) {
        console.error("Storage initialization error:", error);

        toast.error(
          <ToastMessage
            message="Storage initialization failed"
            description={error.message}
          />,
          { ...toastConfig, id: toastId }
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []); // Run once on component mount

  useEffect(() => {
    const initializeStorage = async () => {
      const loadingToast = toast.loading("Initializing storage...");
      try {
        await fetchBucketImages();
        toast.dismiss(loadingToast);
      } catch (error) {
        console.error("Error initializing storage:", error);
        toast.error("Failed to initialize storage");
      }
    };

    initializeStorage();
  }, [currentFolder]); // Re-fetch when folder changes

  // ... copy other necessary functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    toast.success(
      <ToastMessage message={`Page ${newPage + 1}`} />,
      toastConfig
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    toast.success(
      <ToastMessage message={`Showing ${event.target.value} items per page`} />,
      toastConfig
    );
  };

  const handleCopyUrl = async (url) => {
    try {
      // Verify URL is valid before copying

      await navigator.clipboard.writeText(url);
      toast.success(
        <ToastMessage message="URL copied to clipboard" />,
        toastConfig
      );
    } catch (error) {
      console.error("Error copying URL:", error);
      toast.error("Invalid URL or copying failed");
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    disableBodyScroll();
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    enableBodyScroll();
  };

  // Update handleConfirmDelete function
  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting file...", toastConfig);
    try {
      if (!itemToDelete) throw new Error("No file selected for deletion");
      await storageService.deleteFile(itemToDelete.path);
      await fetchBucketImages();
      toast.success("File deleted successfully!", {
        ...toastConfig,
        id: loadingToast,
      });
      handleCloseDelete();
    } catch (error) {
      toast.error(`Failed to delete file: ${error.message}`, {
        ...toastConfig,
        id: loadingToast,
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFolderClick = async (folder) => {
    const loadingId = toast.loading(
      <ToastMessage message={`Opening ${folder}...`} />,
      toastConfig
    );
    try {
      const newFolder = folder === "root" ? "" : folder;
      setCurrentFolder(folder);
      const pathArray = folder === "root" ? ["root"] : ["root", folder];
      setBreadcrumbs(pathArray);
      setPage(0);
      await fetchBucketImages();
      toast.success(<ToastMessage message={`Opened ${folder}`} />, {
        ...toastConfig,
        id: loadingId,
      });
    } catch (error) {
      toast.error(
        <ToastMessage
          message="Failed to open folder"
          description={error.message}
        />,
        { ...toastConfig, id: loadingId }
      );
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = breadcrumbs.slice(0, index + 1);
    const folder = newPath.length === 1 ? "root" : newPath.slice(1).join("/");
    setCurrentFolder(folder);
    setBreadcrumbs(newPath);
    setPage(0);
    toast.success(
      <ToastMessage
        message={`Navigated to ${folder === "root" ? "Home" : folder}`}
      />,
      toastConfig
    );
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!fileToRename || !newFileName.trim()) return;

    const loadingToast = toast.loading("Renaming file...");
    try {
      // Create references for old and new paths
      // const oldRef = ref(configuredStorage, fileToRename.path);
      const fileExtension = fileToRename.name.split(".").pop();
      const newName = `${newFileName.trim()}.${fileExtension}`;
      const newPath = fileToRename.path.replace(fileToRename.name, newName);
      // const newRef = ref(configuredStorage, newPath);

      // Get file metadata
      // const metadata = await getMetadata(oldRef);

      try {
        // Download the file using fetch with CORS mode
        const response = await fetch(fileToRename.url, {
          mode: "cors",
          headers: {
            Origin: window.location.origin,
          },
        });

        if (!response.ok) throw new Error("Failed to download file");

        // Get the file content as blob
        const blob = await response.blob();

        // Upload with new name
        // await uploadBytes(newRef, blob, {
        //   contentType: metadata.contentType,
        //   customMetadata: {
        //     ...metadata.customMetadata,
        //     customName: newName,
        //     originalName: fileToRename.name,
        //   },
        // });

        // Delete old file
        // await deleteObject(oldRef);

        // Refresh the file list
        await fetchBucketImages();

        toast.dismiss(loadingToast);
        toast.success("File renamed successfully!");
        handleCloseRenameDialog();
      } catch (downloadError) {
        console.error("Error downloading file:", downloadError);
        throw new Error("Failed to download file for renaming");
      }
    } catch (error) {
      console.error("Error renaming file:", error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to rename file: ${error.message}`);
    }
  };

  const handleOpenRenameDialog = (file) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameDialogOpen(true);
  };

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
    setFileToRename(null);
    setNewFileName("");
  };

  const handleOpenFolderDialog = () => setOpenFolderDialog(true);
  const handleCloseFolderDialog = () => setOpenFolderDialog(false);
  const handleOpenFileDialog = () => setOpenFileDialog(true);
  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
    setSelectedFile(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(
        <ToastMessage
          message="File selected"
          description={`${file.name} (${formatFileSize(file.size)})`}
        />,
        toastConfig
      );
    }
  };

  // Update handleCreateFolder function
  const handleCreateFolder = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const folderName = formData.get("folderName").trim();

    if (!folderName) {
      toast.error("Please enter a folder name", {
        icon: "📁",
        description: "The folder name cannot be empty",
      });
      return;
    }

    const loadingToast = toast.loading("Creating folder...", {
      description: `Creating ${folderName}`,
    });

    try {
      const path =
        currentFolder === "root"
          ? folderName
          : `${currentFolder}/${folderName}`;
      await storageService.createFolder(path);
      await fetchBucketImages();
      handleCloseFolderDialog();
      toast.success("Folder created", {
        id: loadingToast,
        icon: "📁",
        description: `${folderName} has been created successfully`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error(`Failed to create folder: ${error.message}`, {
        id: loadingToast,
        description: error.message,
        duration: 4000,
      });
    }
  };

  // Update handleUploadFile function
  const handleUploadFile = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      showToast(
        {
          title: "Please select a file",
          description: "No file has been selected for upload",
        },
        "error"
      );
      return;
    }

    const toastId = showToast(
      {
        title: "Uploading file...",
        description: `Uploading ${selectedFile.name}`,
      },
      "loading"
    );

    try {
      const path =
        selectedFolder === "root"
          ? selectedFile.name
          : `${selectedFolder}/${selectedFile.name}`;

      await storageService.uploadFile(selectedFile, path);
      await fetchBucketImages();
      handleCloseFileDialog();

      showToast(
        {
          title: "File uploaded successfully",
          description: selectedFile.name,
        },
        "success"
      );
    } catch (error) {
      showToast(
        {
          title: "Upload failed",
          description: error.message,
        },
        "error"
      );
    }
  };

  // Update the Stats component to filter out 0 byte files
  const Stats = () => {
    const validFiles = bucketImages.filter((img) => img.size > 0);
    const currentFolderFiles =
      currentFolder === "root"
        ? validFiles
        : validFiles.filter((img) => img.folder === currentFolder);

    const totalSize = validFiles.reduce((sum, img) => sum + img.size, 0);
    const folderSize =
      currentFolder === "root"
        ? totalSize
        : validFiles
            .filter((img) => img.path.startsWith(currentFolder))
            .reduce((sum, img) => sum + img.size, 0);

    const folderCount = folders.length - 1; // Subtract 1 for 'root'
    const totalStorage = 1024 * 1024 * 1024; // 1GB

    return (
      <Box sx={styles.statsContainer}>
        {/* Files Card */}
        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FileCopyIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>
              {currentFolder === "root" ? "Total Files" : "Files in Folder"}
            </Typography>
          </Box>
          <Typography sx={styles.statValue}>
            {currentFolderFiles.length}
          </Typography>
        </Paper>

        {/* Size Card */}
        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <StorageIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>
              {currentFolder === "root" ? "Total Size" : "Folder Size"}
            </Typography>
          </Box>
          <Typography sx={styles.statValue}>
            {formatFileSize(folderSize)}
          </Typography>
        </Paper>

        {/* Storage Card */}
        <Paper sx={styles.statCard}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CloudIcon sx={{ color: "#64748B" }} />
            <Typography sx={styles.statLabel}>Storage Used</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}
            >
              <Typography sx={styles.statValue}>
                {formatFileSize(totalSize)}
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem" }}>
                of {formatFileSize(totalStorage)}
              </Typography>
            </Box>
            <Box
              sx={{ mt: 1, width: "100%", bgcolor: "#F1F5F9", borderRadius: 1 }}
            >
              <Box
                sx={{
                  width: `${Math.min((totalSize / totalStorage) * 100, 100)}%`,
                  height: 4,
                  borderRadius: 1,
                  bgcolor:
                    totalSize / totalStorage > 0.9 ? "#EF4444" : "#10B981",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", mt: 0.5, display: "block" }}
            >
              {formatFileSize(totalStorage - totalSize)} available
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };

  const TableSkeleton = () => (
    <Box sx={{ opacity: 0.7 }}>
      {[...Array(rowsPerPage)].map((_, index) => (
        <Box
          key={index}
          sx={{
            height: "60px",
            my: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#F8FAFC",
            borderRadius: 1,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.5 },
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              bgcolor: "#E2E8F0",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                width: "60%",
                height: 16,
                bgcolor: "#E2E8F0",
                mb: 1,
                borderRadius: 0.5,
              }}
            />
            <Box
              sx={{
                width: "40%",
                height: 12,
                bgcolor: "#E2E8F0",
                borderRadius: 0.5,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#0F172A";
    event.currentTarget.style.backgroundColor = "#F1F5F9";
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#CBD5E1";
    event.currentTarget.style.backgroundColor = "#F8FAFC";
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#CBD5E1";
    event.currentTarget.style.backgroundColor = "#F8FAFC";

    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      toast.error(
        <ToastMessage
          message="Invalid file type"
          description="Please drop only image or PDF files"
        />,
        toastConfig
      );
      return;
    }

    setSelectedFile(validFiles[0]);
    toast.success(
      <ToastMessage
        message="File selected"
        description={`${validFiles[0].name} (${formatFileSize(
          validFiles[0].size
        )})`}
      />,
      toastConfig
    );
  };

  const EmptyState = ({ folder }) => (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <CloudIcon
        sx={{
          fontSize: 64,
          color: "#CBD5E1",
          mb: 2,
        }}
      />
      <Typography variant="h6" sx={{ color: "#1E293B", mb: 1 }}>
        No files in {folder === "root" ? "storage" : folder}
      </Typography>
      <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
        Upload files or create folders to organize your content
      </Typography>
      <Button
        variant="contained"
        onClick={handleOpenFileDialog}
        startIcon={<AddIcon />}
        sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        }}
      >
        Upload File
      </Button>
    </Box>
  );

  // Update the currentFiles filter logic
  const currentFiles = bucketImages.filter((image) => {
    // Filter out 0 byte files
    if (image.size === 0) return false;

    // Show all files in root folder
    if (currentFolder === "root") {
      return true; // Show all files regardless of folder
    }

    // Show files in current folder
    return image.folder === currentFolder;
  });

  return (
    // ... copy the bucket images table JSX from ImageUploadForm
    <Box sx={{ width: "100%", p: 3 }}>
      <Toaster
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
          right: 20,
          left: 20,
        }}
        gutter={8}
      />
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
          width: "100%",
        }}
      >
        <Box sx={styles.gradientHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerText}>
                Storage
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your uploaded files
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleOpenFileDialog}
                startIcon={<AddIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                  color: "#0F172A",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  },
                }}
              >
                Upload File
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenFolderDialog}
                startIcon={<FolderIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                  color: "#0F172A",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  },
                }}
              >
                New Folder
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4, width: "100%" }}>
          {/* Breadcrumbs navigation */}
          <Breadcrumbs sx={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => (
              <Typography
                key={crumb}
                sx={{
                  ...styles.breadcrumbLink,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ...(index === breadcrumbs.length - 1 && {
                    className: "active",
                  }),
                }}
                onClick={() => handleBreadcrumbClick(index)}
              >
                {crumb === "root" ? (
                  <>
                    <HomeIcon sx={{ fontSize: 20 }} />
                    Home
                  </>
                ) : (
                  crumb
                )}
              </Typography>
            ))}
          </Breadcrumbs>

          <Stats />

          {/* Folder Grid */}
          {currentFolder === "root" && folders.length > 1 && (
            <Box sx={styles.folderGrid}>
              {folders
                .filter((folder) => folder !== "root")
                .map((folder) => {
                  const folderFiles = bucketImages.filter(
                    (img) => img.folder === folder && img.size > 0 // Only count files with size > 0
                  );
                  const filesCount = folderFiles.length;
                  const folderSize = folderFiles.reduce(
                    (sum, img) => sum + img.size,
                    0
                  );

                  return (
                    <Paper
                      key={folder}
                      sx={styles.folderCard}
                      onClick={() => handleFolderClick(folder)}
                    >
                      <Box sx={styles.folderIcon}>
                        <FolderIcon />
                      </Box>
                      <Typography noWrap sx={styles.folderName}>
                        {folder}
                      </Typography>
                      <Box sx={styles.folderStats}>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {filesCount} {filesCount === 1 ? "file" : "files"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {formatFileSize(folderSize)}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
            </Box>
          )}

          {/* Filter table contents based on current folder */}
          <TableContainer sx={styles.tableContainer}>
            {isLoading ? (
              <TableSkeleton />
            ) : currentFiles.length === 0 ? (
              <EmptyState folder={currentFolder} />
            ) : (
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                      Preview
                    </TableCell>
                    <TableCell sx={{ ...styles.tableHeaderCell, width: "25%" }}>
                      File Name
                    </TableCell>
                    <TableCell sx={{ ...styles.tableHeaderCell, width: "20%" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                      Size
                    </TableCell>
                    <TableCell sx={{ ...styles.tableHeaderCell, width: "15%" }}>
                      Upload Date
                    </TableCell>
                    <TableCell
                      sx={{ ...styles.tableHeaderCell, width: "10%" }}
                      align="right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentFiles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((image) => (
                      <TableRow key={image.id} sx={styles.tableRow}>
                        <TableCell>
                          {image.contentType === "application/pdf" ? (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "8px",
                                backgroundColor: "#F1F5F9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.2s ease",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              <PdfIcon
                                sx={{ fontSize: 32, color: "#EF4444" }}
                              />
                            </Box>
                          ) : image.url ? (
                            <Box
                              component="img"
                              src={image.url}
                              alt={image.name}
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%2364748b" text-anchor="middle" dy=".3em">No Preview</text></svg>';
                              }}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: "8px",
                                transition: "transform 0.2s ease",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                backgroundColor: "#F1F5F9",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                },
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "8px",
                                backgroundColor: "#F1F5F9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#64748B",
                                fontSize: "12px",
                              }}
                            >
                              No Preview
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: "#1E293B",
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {image.name}
                            </Typography>
                            {/* Always show folder info in root view */}
                            {(currentFolder === "root" ||
                              image.folder !== "root") && (
                              <Typography
                                sx={{
                                  color: "#64748B",
                                  fontSize: "0.75rem",
                                  mt: 0.5,
                                }}
                              >
                                in{" "}
                                {image.folder === "root"
                                  ? "Root Folder"
                                  : image.folder}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: "#64748B",
                              fontSize: "0.875rem",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FileCopyIcon sx={{ fontSize: 16 }} />
                            {image.contentType.split("/")[1].toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ color: "#64748B", fontSize: "0.875rem" }}
                          >
                            {formatFileSize(image.size)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ color: "#64748B", fontSize: "0.875rem" }}
                          >
                            {new Date(image.uploadTime).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Tooltip title="Copy URL">
                              <IconButton
                                onClick={() => handleCopyUrl(image.url)}
                                sx={{
                                  color: "#64748B",
                                  "&:hover": {
                                    backgroundColor: "#F1F5F9",
                                    color: "#1E293B",
                                    transform: "translateY(-2px)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                                size="small"
                              >
                                <ContentCopyIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(image)}
                                sx={{
                                  color: "#EF4444",
                                  "&:hover": {
                                    backgroundColor: "#FEE2E2",
                                    transform: "translateY(-2px)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                                size="small"
                              >
                                <DeleteIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={currentFiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        </Box>
      </Paper>
      <Dialog
        open={openFolderDialog}
        onClose={handleCloseFolderDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={styles.dialogTitle}>Create New Folder</DialogTitle>
        <form onSubmit={handleCreateFolder}>
          <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={dialogStyles.folderIcon}>
                  <FolderIcon />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Create a new folder to organize your files
                </Typography>
              </Box>

              <Box sx={dialogStyles.folderInput}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  Folder Name
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FolderIcon sx={{ color: "#64748B" }} />
                  <input
                    name="folderName"
                    type="text"
                    placeholder="Enter folder name"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0F172A";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(15, 23, 42, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Folder will be created in:{" "}
                  {currentFolder === "root" ? "Root" : currentFolder}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={handleCloseFolderDialog}
              sx={{
                color: "#64748B",
                "&:hover": {
                  backgroundColor: "#F1F5F9",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                },
              }}
            >
              Create Folder
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openFileDialog}
        onClose={handleCloseFileDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={styles.dialogTitle}>Upload File</DialogTitle>
        <form onSubmit={handleUploadFile}>
          <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* File Upload Area */}
              <Box
                sx={dialogStyles.uploadArea}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      size={64}
                      thickness={4}
                      sx={{
                        color: "#0F172A",
                        mb: 2,
                        "& .MuiCircularProgress-circle": {
                          strokeLinecap: "round",
                        },
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#1E293B", mb: 1 }}>
                      Uploading...
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {uploadProgress}% complete
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      onChange={handleFileSelect}
                      accept="image/*,.pdf"
                    />
                    <Box sx={dialogStyles.uploadIcon}>
                      <AddIcon />
                    </Box>
                    <Typography variant="h6" sx={{ color: "#1E293B", mb: 1 }}>
                      Click to select or drag and drop
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748B", mb: 3 }}
                    >
                      Upload your files here
                    </Typography>

                    <Box sx={dialogStyles.supportedFormats}>
                      <Box sx={dialogStyles.formatChip}>
                        <ImageIcon sx={{ fontSize: 16 }} />
                        PNG
                      </Box>
                      <Box sx={dialogStyles.formatChip}>
                        <ImageIcon sx={{ fontSize: 16 }} />
                        JPG
                      </Box>
                      <Box sx={dialogStyles.formatChip}>
                        <ImageIcon sx={{ fontSize: 16 }} />
                        GIF
                      </Box>
                      <Box sx={dialogStyles.formatChip}>
                        <PdfIcon sx={{ fontSize: 16 }} />
                        PDF
                      </Box>
                      <Box sx={dialogStyles.formatChip}>
                        <StorageIcon sx={{ fontSize: 16 }} />
                        Up to 10MB
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Selected File Info */}
              {selectedFile && (
                <Box sx={dialogStyles.fileInfo}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" noWrap>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedFile(null)}
                    sx={{ color: "#EF4444" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              {/* Folder Selection */}
              <FormControl fullWidth>
                <InputLabel>Destination Folder</InputLabel>
                <Select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  label="Destination Folder"
                >
                  <MenuItem value="root">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FolderIcon sx={{ color: "#64748B" }} />
                      Root Folder
                    </Box>
                  </MenuItem>
                  {folders
                    .filter((f) => f !== "root")
                    .map((folder) => (
                      <MenuItem key={folder} value={folder}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FolderIcon sx={{ color: "#64748B" }} />
                          {folder}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button onClick={handleCloseFileDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedFile}
              sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                },
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={renameDialogOpen} onClose={handleCloseRenameDialog}>
        <DialogTitle sx={styles.dialogTitle}>Rename File</DialogTitle>
        <form onSubmit={handleRename}>
          <DialogContent sx={styles.dialogContent}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="New File Name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                variant="outlined"
                sx={styles.dialogField}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button onClick={handleCloseRenameDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!newFileName.trim()}
            >
              Rename
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <StyledDialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DeleteIcon sx={{ color: "#EF4444" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delete File
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDelete}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </StyledDialogTitle>

        <DialogContent sx={styles.dialogContent}>
          {itemToDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2.5,
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  component="img"
                  src={itemToDelete.url}
                  alt={itemToDelete.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%2364748b" text-anchor="middle" dy=".3em">No Preview</text></svg>';
                  }}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    backgroundColor: "#F1F5F9",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      mb: 0.5,
                    }}
                  >
                    {itemToDelete.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {formatFileSize(itemToDelete.size)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      display: "block",
                      mt: 1,
                    }}
                  >
                    Uploaded on{" "}
                    {new Date(itemToDelete.uploadTime).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: "#1E293B",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Are you sure you want to delete this file?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                ⚠️ This action cannot be undone. The file will be permanently
                removed from storage.
              </Typography>
            </motion.div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Button
            onClick={handleCloseDelete}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={styles.deleteButton}
          >
            Delete File
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default StorageForm;
