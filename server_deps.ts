export * from "https://raw.githubusercontent.com/lucacasonato/fresh/64da4005bb1cd5cf239ca8b2ebec2146987fecf1/server.ts";

// Std
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.119.0/http/http_status.ts";
export { decode } from "https://deno.land/std@0.119.0/encoding/base64.ts";

// AWS
export { S3Bucket } from "https://deno.land/x/s3@0.4.1/mod.ts";
export type { GetObjectResponse } from "https://deno.land/x/s3@0.4.1/mod.ts";
export { DynamoDB } from "https://aws-api.deno.dev/v0.2/services/dynamodb.ts?actions=GetItem,PutItem,Scan";
export { ApiFactory } from "https://deno.land/x/aws_api@v0.5.0/client/mod.ts";
export {
  marshall,
  unmarshall,
} from "https://cdn.skypack.dev/@aws-sdk/util-dynamodb@3.13.0";
