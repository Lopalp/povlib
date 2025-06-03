import os
import json
import argparse
from google.cloud import storage
import requests
from pathlib import Path

def parse_demo(file_path, project_id=None, bucket_name=None, cloud_run_url=None, timeout=600):
    project_id = project_id or os.environ.get("GCP_PROJECT_ID")
    bucket_name = bucket_name or os.environ.get("GCS_BUCKET_NAME")
    cloud_run_url = cloud_run_url or os.environ.get("CLOUD_RUN_URL")
    if not project_id or not bucket_name or not cloud_run_url:
        raise ValueError("Missing configuration: project_id, bucket_name, and cloud_run_url are required")

    client = storage.Client(project=project_id)
    bucket = client.bucket(bucket_name)
    dest = f"demos_for_analysis/{Path(file_path).name}"
    bucket.blob(dest).upload_from_filename(file_path)

    gcs_uri = f"gs://{bucket_name}/{dest}"
    resp = requests.post(f"{cloud_run_url}/parse_gcs_demo", json={"gcs_uri": gcs_uri}, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def main():
    parser = argparse.ArgumentParser(description="Upload a .dem file to GCS and parse via Cloud Run")
    parser.add_argument("file", help="Path to the .dem file")
    args = parser.parse_args()
    result = parse_demo(args.file)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
