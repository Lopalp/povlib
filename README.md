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

The project includes small helpers to upload a demo file to Google Cloud Storage
and trigger a Cloud Run service for parsing. You can use either a Node.js or a
Python script.

Set the following environment variables in your shell:

```
export GCP_PROJECT_ID=<your-project-id>
export GCS_BUCKET_NAME=<your-bucket>
export CLOUD_RUN_URL=<https://your-cloud-run-url>
```

### Node.js helper

Install dependencies and run the script with a path to a `.dem` file:

```
npm run parse-demo ./path/to/file.dem
```

The script uploads the file, calls the `/parse_gcs_demo` endpoint and prints the
JSON response.

### Python helper

Alternatively you can run the Python script:

```bash
python scripts/parse_demo.py ./path/to/file.dem
```
