import { google } from "googleapis";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();



function getCredsFromEnvOrFile() {

  if (process.env.GOOGLE_SERVICE_ACCOUNT) {

    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  }

  const p = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;

  if (p && fs.existsSync(p)) {

    return JSON.parse(fs.readFileSync(p, "utf8"));

  }

  throw new Error("Google service account JSON not found in env or path");

}



const creds = getCredsFromEnvOrFile();



const auth = new google.auth.GoogleAuth({

  credentials: creds,

  scopes: ["https://www.googleapis.com/auth/drive.file"]

});



const drive = google.drive({ version: "v3", auth });



export async function uploadFileToDriveFromPath(localFilePath) {

  const fileName = localFilePath.split("/").pop();

  const res = await drive.files.create({

    requestBody: {

      name: fileName,

      parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,

    },

    media: {

      body: fs.createReadStream(localFilePath),

    },

    fields: "id, name, webViewLink"

  });

  return res.data;

}







