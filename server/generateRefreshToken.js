import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  "87145681483-o62j1kn0ejh8ngmm50buedq7knjpi4mn.apps.googleusercontent.com",
  "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",
  "https//localhost:500" // or redirect URI
);

const scopes = ["https://www.googleapis.com/auth/drive.file"];

const authUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: scopes });

console.log("Open this URL in a browser:", authUrl);
