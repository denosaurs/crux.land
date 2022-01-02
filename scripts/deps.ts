export { Status } from "https://deno.land/std@0.119.0/http/http_status.ts";

export { DynamoDB } from "https://aws-api.deno.dev/v0.2/services/dynamodb.ts?actions=DescribeTable,CreateTable";
export { S3 } from "https://aws-api.deno.dev/v0.2/services/s3.ts?actions=HeadBucket,CreateBucket";
export { ApiFactory } from "https://deno.land/x/aws_api@v0.5.0/client/mod.ts";
