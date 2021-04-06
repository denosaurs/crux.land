import { CreateBucketCommand, HeadBucketCommand, S3Client } from "./deps.ts";
import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "../util/constants.ts";

const client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

try {
  // @ts-ignore TS2339
  await client.send(
    new HeadBucketCommand({
      Bucket: S3_BUCKET,
    }),
  );
  console.log("Bucket already exists");
} catch (err) {
  console.log("Bucket not found");
  console.log("Creating bucket");
  // @ts-ignore TS2339
  await client.send(
    new CreateBucketCommand({
      Bucket: S3_BUCKET,
    }),
  );
}
