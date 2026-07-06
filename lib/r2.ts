import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL;

export function isR2Configured() {
  return Boolean(endpoint && accessKeyId && secretAccessKey && bucket);
}

function client() {
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 is not configured — set R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY"
    );
  }
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  if (!bucket) throw new Error("Missing R2_BUCKET environment variable");
  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  if (!publicUrl) {
    throw new Error(
      "Missing R2_PUBLIC_URL — set it to the bucket's public dev URL or custom domain to read files back"
    );
  }
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  if (!bucket) throw new Error("Missing R2_BUCKET environment variable");
  await client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Extract the object key from a previously-returned public URL. */
export function keyFromPublicUrl(url: string): string | null {
  if (!publicUrl) return null;
  const base = publicUrl.replace(/\/$/, "") + "/";
  return url.startsWith(base) ? url.slice(base.length) : null;
}
