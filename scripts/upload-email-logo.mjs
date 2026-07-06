// Uploads the BlueZoid logo to R2 once, for use in outbound email templates
// (Gmail web doesn't reliably render base64 data-URI images, so we need a hosted URL).
// Run with: node --env-file=.env.local scripts/upload-email-logo.mjs
import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.error("Missing R2 env vars — run with: node --env-file=.env.local scripts/upload-email-logo.mjs");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const key = "email-assets/logo.png";
const body = readFileSync("public/logo.png");

await client.send(
  new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: "image/png" })
);

const url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
console.log("Uploaded. Public URL:", url);
