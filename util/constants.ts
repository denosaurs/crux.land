// Max file size (10000 bytes / 10 kB)
export const MAX_SIZE = 1000 * 10;

export const EXTENSIONS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "mjs",
  "cjs",
] as const;

export const CONTENT_TYPE_FROM_EXTENSION = {
  "ts": "application/typescript",
  "tsx": "text/tsx",
  "js": "application/javascript",
  "jsx": "text/jsx",
  "mjs": "application/javascript",
  "cjs": "application/javascript",
} as const;

export const EXTENSION_FROM_CONTENT_TYPE = {
  "application/typescript": "ts",
  "text/tsx": "tsx",
  "application/javascript": "js",
  "text/jsx": "jsx",
} as const;

export const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const MIN_LEN = 1;
export const MAX_LEN = 6;

export const S3_BUCKET = Deno.env.get("S3_BUCKET")!;
export const S3_REGION = Deno.env.get("S3_REGION")!;
export const S3_ACCESS_KEY_ID = Deno.env.get("S3_ACCESS_KEY_ID")!;
export const S3_SECRET_ACCESS_KEY = Deno.env.get("S3_SECRET_ACCESS_KEY")!;
