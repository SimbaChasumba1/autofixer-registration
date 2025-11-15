import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Upload video to Storage bucket "user-videos"
export const uploadVideo = async (fileBuffer, filename, mimetype) => {
  const { data, error } = await supabase.storage
    .from('user-videos')
    .upload(filename, fileBuffer, { contentType: mimetype });

  if (error) throw error;

  const { publicURL } = supabase.storage.from('user-videos').getPublicUrl(filename);
  return publicURL;
};

// Optional: fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};
