/// <reference lib="DOM.Iterable" />
/// <reference lib="DOM.AsyncIterable" />

// Std
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.94.0/http/http_status.ts";
export { decode } from "https://deno.land/std@0.94.0/encoding/base64.ts";

// AWS
export { S3Bucket } from "https://deno.land/x/s3@0.4.1/mod.ts";
export type { GetObjectResponse } from "https://deno.land/x/s3@0.4.1/mod.ts";
export { DynamoDB } from "https://aws-api.deno.dev/v0.2/services/dynamodb.ts?actions=GetItem,PutItem";
export { ApiFactory } from "https://deno.land/x/aws_api@v0.5.0/client/mod.ts";
export {
  marshall,
  unmarshall,
} from "https://cdn.skypack.dev/@aws-sdk/util-dynamodb@3.13.0";

// Preact
export { Fragment, h } from "https://x.lcas.dev/preact@10.5.12/mod.js";
export type {
  ComponentChildren,
  JSX,
  VNode,
} from "https://x.lcas.dev/preact@10.5.12/mod.d.ts";
export { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

// Twind
export { setup } from "https://esm.sh/twind@0.16.13";
export {
  getStyleTag,
  shim,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

// Font Awesome
export { FontAwesomeIcon } from "https://esm.sh/@fortawesome/react-fontawesome@0.1.14";
export {
  faDiscord,
  faGithub,
  faTwitter,
} from "https://esm.sh/@fortawesome/free-brands-svg-icons@5.15.3";

// Prism
import PrismExports from "https://jspm.dev/prism-react-renderer@1.2.0";
// @ts-ignore TS2339
export const Highlight = PrismExports.default;
export { Prism } from "https://jspm.dev/prism-react-renderer@1.2.0";
export { default as theme } from "https://jspm.dev/prism-react-renderer@1.2.0/themes/github";

// Router
export { router } from "https://crux.land/router@0.0.1";
export type { Match } from "https://crux.land/router@0.0.1";

export * from "https://raw.githubusercontent.com/lucacasonato/fresh/aa1e1bcdb4693610feb3eb4ad7bba460c54cacaf/server.ts";
