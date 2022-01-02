import { ApiFactory, S3 } from "./deps.ts";
import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "../util/backend_constants.ts";

const client = new ApiFactory({
  region: S3_REGION,
  credentials: {
    awsSecretKey: S3_ACCESS_KEY_ID,
    awsAccessKeyId: S3_SECRET_ACCESS_KEY,
  },
}).makeNew(S3);

try {
  await client.headBucket({
    Bucket: S3_BUCKET,
  });
  console.log("Bucket already exists");
} catch {
  console.log("Bucket not found");
  console.log("Creating bucket");
  await client.createBucket({
    Bucket: S3_BUCKET,
  });
}
