import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // use service role key for uploads
);

// Upload video to private bucket
export async function uploadVideo(fileBuffer, fileName, mimeType) {
  const { data, error } = await supabase.storage
    .from('user-videos')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) throw error;

  // Generate signed URL valid for 1 hour
  const { signedURL, error: urlError } = await supabase.storage
    .from('user-videos')
    .createSignedUrl(fileName, 60 * 60);

  if (urlError) throw urlError;

  return signedURL;
}
