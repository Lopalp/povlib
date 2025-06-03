"""Helper script to upload a .dem file to GCS and invoke the Cloud Run parser."""

import argparse
import json
import os
from pathlib import Path

import requests
from google.cloud import storage


# --- KONFIGURATION ---
# Diese Werte können über Umgebungsvariablen überschrieben werden
PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "storied-lodge-461717-p7")
GCS_BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME", "povlib-demobucket")
CLOUD_RUN_SERVICE_URL = os.environ.get(
    "CLOUD_RUN_URL", "https://demo-parser-api-290911430119.europe-west1.run.app"
)
API_TIMEOUT_MS = int(os.environ.get("API_TIMEOUT_MS", "600000"))
API_REQUEST_TIMEOUT = API_TIMEOUT_MS / 1000  # Sekunden
CREDENTIALS_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
GCS_DEST_PREFIX = os.environ.get("GCS_DEST_PREFIX", "demos_for_analysis/")
# --- ENDE KONFIGURATION ---


def parse_demo(local_file):
    """Upload the demo to GCS and parse it via Cloud Run."""

    if not PROJECT_ID or not GCS_BUCKET_NAME or not CLOUD_RUN_SERVICE_URL:
        raise EnvironmentError(
            "GCP_PROJECT_ID, GCS_BUCKET_NAME und CLOUD_RUN_URL müssen gesetzt sein"
        )

    file_path = Path(local_file)
    if not file_path.exists():
        raise FileNotFoundError(f"Datei '{file_path}' wurde nicht gefunden")

    destination = f"{GCS_DEST_PREFIX}{file_path.name}"
    gcs_uri = f"gs://{GCS_BUCKET_NAME}/{destination}"

    print(f"Lade '{file_path}' nach GCS hoch (Ziel: '{gcs_uri}')...")
    if CREDENTIALS_PATH:
        client = storage.Client.from_service_account_file(
            CREDENTIALS_PATH, project=PROJECT_ID
        )
    else:
        try:
            client = storage.Client(project=PROJECT_ID)
        except Exception as e:  # fallback to show clearer message
            raise EnvironmentError(
                "Google Cloud credentials nicht gefunden. Setze GOOGLE_APPLICATION_CREDENTIALS oder authentifiziere dich mit gcloud." 
            ) from e
    bucket = client.bucket(GCS_BUCKET_NAME)
    bucket.blob(destination).upload_from_filename(str(file_path), timeout=300)
    print("Upload erfolgreich.")

    api_endpoint = f"{CLOUD_RUN_SERVICE_URL}/parse_gcs_demo"
    print(f"Sende GCS URI an API-Endpunkt: {api_endpoint}")

    resp = requests.post(
        api_endpoint,
        json={"gcs_uri": gcs_uri},
        headers={"Content-Type": "application/json"},
        timeout=API_REQUEST_TIMEOUT,
    )
    print(f"Status Code: {resp.status_code}")

    if resp.headers.get("Content-Type", "").startswith("application/json"):
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    else:
        print(resp.text)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Upload a .dem file to GCS and parse it via Cloud Run"
    )
    parser.add_argument("file", help="Pfad zur .dem Datei")
    args = parser.parse_args()

    parse_demo(args.file)


if __name__ == "__main__":
    main()

