import { DynamoDBClient, S3Bucket } from "../deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "./constants.ts";

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: DYNAMO_REGION,
  credentials: {
    accessKeyId: DYNAMO_ACCESS_KEY_ID,
    secretAccessKey: DYNAMO_SECRET_ACCESS_KEY,
  },
});

export const S3_CLIENT = new S3Bucket({
  region: S3_REGION,
  accessKeyID: S3_ACCESS_KEY_ID,
  secretKey: S3_SECRET_ACCESS_KEY,
  bucket: S3_BUCKET,
});
