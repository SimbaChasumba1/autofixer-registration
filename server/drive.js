import { google } from "googleapis";

import fs from "fs";

import path from "path";



const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

const SERVICE_JSON_ENV = process.env.GOOGLE_SERVICE_ACCOUNT; // JSON string

const SERVICE_JSON_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_PATH; // optional file path



function getCredentials() {

  if (SERVICE_JSON_ENV) {

    return JSON.parse(SERVICE_JSON_ENV);

  }

  if (SERVICE_JSON_PATH && fs.existsSync(SERVICE_JSON_PATH)) {

    return JSON.parse(fs.readFileSync(SERVICE_JSON_PATH, "utf8"));

  }

  throw new Error("Google service account credentials not found in env or path");

}



let authClient;

export function getAuth() {

  if (authClient) return authClient;

  const credentials = getCredentials();

  authClient = new google.auth.GoogleAuth({

    credentials,

    scopes: ["https://www.googleapis.com/auth/drive.file"]

  });

  return authClient;

}



/**

 * Uploads a file at localFilePath to Drive folder set in env GOOGLE_DRIVE_FOLDER_ID.

 * Returns { id, name, mimeType, size, webViewLink }.

 */

export async function uploadFileToDrive(localFilePath, originalName, mimeType) {

  const auth = getAuth();

  const drive = google.drive({ version: "v3", auth });



  const res = await drive.files.create({

    requestBody: {

      name: originalName,

      parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : undefined

    },

    media: {

      mimeType: mimeType || "application/octet-stream",

      body: fs.createReadStream(localFilePath)

    },

    fields: "id, name, mimeType, size, webViewLink"

  });



  return res.data;

}

