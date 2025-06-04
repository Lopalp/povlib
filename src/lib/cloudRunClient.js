import path from 'path';
import { Storage } from '@google-cloud/storage';

// Default values matching the provided Colab script
const DEFAULT_PROJECT_ID = 'storied-lodge-461717-p7';
const DEFAULT_BUCKET_NAME = 'povlib-demobucket';
const DEFAULT_CLOUD_RUN_URL =
  'https://demo-parser-api-290911430119.europe-west1.run.app';
const DEFAULT_TIMEOUT_MS = 600000;

/**
 * Upload a demo file to Google Cloud Storage and trigger the Cloud Run parser.
 * @param {string} filePath - Local path to the .dem file.
 * @param {object} [options]
 * @param {string} [options.projectId] - GCP project ID.
 * @param {string} [options.bucketName] - GCS bucket.
 * @param {string} [options.destination] - Path in the bucket. Defaults to `demos_for_analysis/<filename>`.
 * @param {string} [options.cloudRunUrl] - Base URL of the Cloud Run service.
 * @param {number} [options.timeoutMs] - Request timeout in milliseconds. Defaults to 10 minutes.
 * @returns {Promise<object>} Parsed JSON response from the Cloud Run service.
 */
export async function parseDemoWithCloudRun(
  filePath,
  {
    projectId = DEFAULT_PROJECT_ID,
    bucketName = DEFAULT_BUCKET_NAME,
    destination = `demos_for_analysis/${path.basename(filePath)}`,
    cloudRunUrl = DEFAULT_CLOUD_RUN_URL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS,
  } = {}
) {
  if (!projectId || !bucketName || !cloudRunUrl) {
    throw new Error('Missing configuration: projectId, bucketName and cloudRunUrl are required');
  }
  let storage;
  try {
    storage = keyFilename
      ? new Storage({ projectId, keyFilename })
      : new Storage({ projectId });
  } catch (err) {
    if (err.message && err.message.includes('Could not load the default credentials')) {
      throw new Error(
        'Google Cloud credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS or run `gcloud auth application-default login`.'
      );
    }
    throw err;
  }
  const bucket = storage.bucket(bucketName);
  await bucket.upload(filePath, { destination });

  const gcsUri = `gs://${bucketName}/${destination}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${cloudRunUrl}/parse_gcs_demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gcs_uri: gcsUri }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloud Run request failed: ${res.status} ${text}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Request the Cloud Run parser for an already uploaded demo.
 * @param {string} gcsUri - URI of the uploaded demo, e.g. gs://bucket/file.dem
 * @param {object} [options]
 * @param {string} [options.cloudRunUrl] - Cloud Run base URL
 * @param {number} [options.timeoutMs] - Request timeout in ms
 * @returns {Promise<object>} Parsed JSON
 */
export async function parseDemoFromGCSUri(
  gcsUri,
  {
    cloudRunUrl = DEFAULT_CLOUD_RUN_URL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {}
) {
  if (!cloudRunUrl) {
    throw new Error('Missing configuration: cloudRunUrl is required');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${cloudRunUrl}/parse_gcs_demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gcs_uri: gcsUri }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloud Run request failed: ${res.status} ${text}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generate a signed GCS upload URL for a demo file.
 * @param {string} fileName - Name of the file to upload.
 * @param {object} [options]
 * @param {string} [options.projectId]
 * @param {string} [options.bucketName]
 * @param {string} [options.prefix]
 * @returns {Promise<{uploadUrl: string, gcsUri: string}>}
 */
export async function getSignedUploadUrl(
  fileName,
  {
    projectId = DEFAULT_PROJECT_ID,
    bucketName = DEFAULT_BUCKET_NAME,
    prefix = 'demos_for_analysis/',
    keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS,
  } = {}
) {
  if (!projectId || !bucketName) {
    throw new Error('Missing configuration: projectId and bucketName are required');
  }

  let storage;
  try {
    storage = keyFilename
      ? new Storage({ projectId, keyFilename })
      : new Storage({ projectId });
  } catch (err) {
    if (err.message && err.message.includes('Could not load the default credentials')) {
      throw new Error(
        'Google Cloud credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS or run `gcloud auth application-default login`.'
      );
    }
    throw err;
  }
  const bucket = storage.bucket(bucketName);
  const destination = `${prefix}${Date.now()}_${fileName}`;
  const file = bucket.file(destination);
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const [url] = await file.getSignedUrl({ version: 'v4', action: 'write', expires });

  return { uploadUrl: url, gcsUri: `gs://${bucketName}/${destination}` };
}
