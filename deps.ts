/// <reference lib="DOM.Iterable" />
// @ts-ignore TS2726
/// <reference lib="DOM.AsyncIterable" />

// Std
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.91.0/http/http_status.ts";

// AWS
export { S3Bucket } from "https://deno.land/x/s3@0.4.0/mod.ts";
export type { GetObjectResponse } from "https://deno.land/x/s3@0.4.0/mod.ts";
export {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://cdn.skypack.dev/@aws-sdk/client-dynamodb@3.9.0";

// Preact
export { default as preact, h } from "https://x.lcas.dev/preact@10.5.11/mod.js";
export type { JSX } from "https://x.lcas.dev/preact@10.5.11/mod.d.ts";
export { default as render } from "https://x.lcas.dev/preact@10.5.11/ssr.js";

// Prism
import PrismExports from "https://jspm.dev/prism-react-renderer@1.2.0";
// @ts-ignore TS2339
export const Highlight = PrismExports.default;
export { Prism } from "https://jspm.dev/prism-react-renderer@1.2.0";
export { default as theme } from "https://jspm.dev/prism-react-renderer@1.2.0/themes/github";

// Router
export { match } from "https://cdn.skypack.dev/path-to-regexp@6.2.0?dts";
