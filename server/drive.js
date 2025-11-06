import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

function getCredsFromEnvOrFile() {
  // Debug log (you can remove later)
  console.log("GOOGLE_SERVICE_ACCOUNT present?", !!process.env.GOOGLE_SERVICE_ACCOUNT);
  console.log("GOOGLE_SERVICE_ACCOUNT_PATH:", process.env.GOOGLE_SERVICE_ACCOUNT_PATH);

  // 1️⃣ Check if JSON is directly in env
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    } catch (err) {
      console.error("❌ Failed to parse GOOGLE_SERVICE_ACCOUNT:", err);
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT format");
    }
  }

  // 2️⃣ Otherwise try a path to file
  const p = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
  if (p && fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  }

  // 3️⃣ Fail clearly if missing
  throw new Error("Google service account JSON not found in env or path");
}

const creds = getCredsFromEnvOrFile();

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export async function uploadFileToDriveFromPath(localFilePath) {
  const fileName = localFilePath.split("/").pop();

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID
        ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
        : undefined,
    },
    media: {
      body: fs.createReadStream(localFilePath),
    },
    fields: "id, name, webViewLink",
  });

  return res.data;
}
