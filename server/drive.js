import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";
import stream from "stream";  // Import stream to handle buffer streams

dotenv.config();

// Function to get credentials from environment variables or a file
function getCredsFromEnvOrFile() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);  // Read from env
  }

  const p = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
  if (p && fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, "utf8"));  // Read from file (if deployed)
  }

  throw new Error("Google service account JSON not found in env or path");
}

// Get credentials for Google service account
const creds = getCredsFromEnvOrFile();

// Set up the Google Auth client with the service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/drive.file"],  // The Drive API scope
});

// Google Drive client
const drive = google.drive({ version: "v3", auth });

// Function to upload file directly from buffer (for serverless environments)
export async function uploadFileToDriveFromBuffer(buffer, fileName, mimeType) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);  // End the stream with the provided buffer

  const fileMetadata = {
    name: fileName,  // Set the file name
  };

  const media = {
    mimeType,  // Mime type for the file
    body: bufferStream,  // Stream the buffer data
  };

  try {
    // Upload the file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",  // We want to return file ID and web view link
    });

    return response.data;  // Return file details including ID and web view link
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err);
    throw new Error("Failed to upload file to Google Drive");
  }
}
