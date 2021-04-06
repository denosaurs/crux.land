export { Status } from "https://deno.land/std@0.91.0/http/http_status.ts";

export {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ResourceNotFoundException,
} from "https://cdn.skypack.dev/@aws-sdk/client-dynamodb@3.9.0";

export {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  S3Client,
} from "https://cdn.skypack.dev/@aws-sdk/client-s3@3.9.0";
