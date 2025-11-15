// supabase.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add this helper to upload videos
export async function uploadVideo(file, path) {
  const { data, error } = await supabase.storage
    .from("user-videos")
    .upload(path, file);

  if (error) throw error;
  return data;
}
