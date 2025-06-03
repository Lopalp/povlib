import { Storage } from '@google-cloud/storage';
import { pipeline } from 'node:stream/promises';
import { basename } from 'node:path';
import {
  project_id,
  gcs_bucket_name,
  cloud_run_service_url,
  api_request_timeout
} from './config';

async function uploadAndParseDemo(options = {}) {
  const projectId = options.project_id || project_id;
  const bucketName = options.gcs_bucket_name || gcs_bucket_name;
  const fileStream = options.fileStream;
  const filePath = options.local_file_path;
  const fileName = options.fileName || (filePath ? basename(filePath) : 'demo.dem');
  const destinationBlob = options.gcs_destination_blob_name || `demos_fuer_analyse/${fileName}`;
  const serviceUrl = options.cloud_run_service_url || cloud_run_service_url;
  const endpoint = options.api_endpoint_gcs || `${serviceUrl}/parse_gcs_demo`;
  const timeoutSeconds = options.api_request_timeout || api_request_timeout;

  if (!fileStream && !filePath) {
    throw new Error('Either fileStream or local_file_path must be provided');
  }

  const storage = new Storage({ projectId });
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(destinationBlob);

  if (fileStream) {
    await pipeline(fileStream, blob.createWriteStream({ resumable: false, timeout: 300000 }));
  } else {
    await bucket.upload(filePath, { destination: destinationBlob, timeout: 300000 });
  }

  const gcsUri = `gs://${bucketName}/${destinationBlob}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gcs_uri: gcsUri }),
      signal: controller.signal
    });

    const contentType = response.headers.get('Content-Type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    return { status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}

export { uploadAndParseDemo };
