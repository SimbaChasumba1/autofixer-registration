import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

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

const creds = getCredsFromEnvOrFile();

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/drive.file"]
});

const drive = google.drive({ version: "v3", auth });

// Upload file directly from buffer (for serverless environments)
export async function uploadFileToDriveFromBuffer(fileBuffer, fileName) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
    },
    media: {
      body: fileBuffer,  // File buffer directly passed
    },
    fields: "id, name, webViewLink"
  });

  return res.data;
}
