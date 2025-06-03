#!/usr/bin/env node
import path from 'path';
import { parseDemoWithCloudRun } from '../src/lib/cloudRunClient.js';

const [, , filePath] = process.argv;

if (!filePath) {
  console.error('Usage: parse-demo <path-to-dem-file>');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), filePath);

parseDemoWithCloudRun(resolvedPath)
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
