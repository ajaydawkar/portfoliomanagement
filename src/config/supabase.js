import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabaseStorageBucket =
  process.env.REACT_APP_SUPABASE_STORAGE_BUCKET;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
