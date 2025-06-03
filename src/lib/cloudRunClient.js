import path from 'path';
import { Storage } from '@google-cloud/storage';

/**
 * Upload a demo file to Google Cloud Storage and trigger the Cloud Run parser.
 * @param {string} filePath - Local path to the .dem file.
 * @param {object} [options]
 * @param {string} [options.projectId] - GCP project ID. Defaults to GCP_PROJECT_ID env var.
 * @param {string} [options.bucketName] - GCS bucket. Defaults to GCS_BUCKET_NAME env var.
 * @param {string} [options.destination] - Path in the bucket. Defaults to `demos_for_analysis/<filename>`.
 * @param {string} [options.cloudRunUrl] - Base URL of the Cloud Run service. Defaults to CLOUD_RUN_URL env var.
 * @param {number} [options.timeoutMs] - Request timeout in milliseconds. Defaults to 10 minutes.
 * @returns {Promise<object>} Parsed JSON response from the Cloud Run service.
 */
export async function parseDemoWithCloudRun(
  filePath,
  {
    projectId = process.env.GCP_PROJECT_ID,
    bucketName = process.env.GCS_BUCKET_NAME,
    destination = `demos_for_analysis/${path.basename(filePath)}`,
    cloudRunUrl = process.env.CLOUD_RUN_URL,
    timeoutMs = 10 * 60 * 1000,
  } = {}
) {
  if (!projectId || !bucketName || !cloudRunUrl) {
    throw new Error('Missing configuration: projectId, bucketName and cloudRunUrl are required');
  }

  const storage = new Storage({ projectId });
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
