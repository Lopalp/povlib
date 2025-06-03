This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Parsing Demos with Cloud Run

The project includes a helper script to upload a demo file to Google Cloud
Storage and trigger a Cloud Run service for parsing.

The helper scripts and API routes will use the following default configuration,
which can be overridden via environment variables:

```
export GCP_PROJECT_ID=storied-lodge-461717-p7
export GCS_BUCKET_NAME=povlib-demobucket
export CLOUD_RUN_URL=https://demo-parser-api-290911430119.europe-west1.run.app
export API_TIMEOUT_MS=600000   # optional
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

The `GOOGLE_APPLICATION_CREDENTIALS` variable should point to a service
account JSON key or use `gcloud auth application-default login` to set up
application default credentials.

### Python helper

Run the script with a path to a `.dem` file:

```bash
python scripts/parse_demo.py ./path/to/file.dem
```

### Uploading in the browser

Large demos should be uploaded directly to Google Cloud Storage. The
`ParseDemoModal` component requests a signed upload URL from
`/api/get-upload-url`, uploads the selected file and then calls
`/api/parse-gcs-demo` to trigger the Cloud Run parser. Ensure the same
environment variables are configured on the server so signed URLs can be
generated.
