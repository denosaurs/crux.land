// Max file size (20000 bytes / 20 kB)
export const MAX_SIZE = 2000 * 10;

export const EXTENSIONS = [
  "ts",
  "tsx",
  "mts",
  "js",
  "jsx",
  "mjs",
  // "cjs",
  // "json",
  // "wasm",
] as const;

export const CONTENT_TYPE_FROM_EXTENSION = {
  "ts": "application/typescript",
  "tsx": "text/tsx",
  "js": "application/javascript",
  "jsx": "text/jsx",
  "mjs": "application/javascript",
  "cjs": "application/javascript",
  "json": "application/json",
  "wasm": "application/wasm",
} as const;

export const EXTENSION_FROM_CONTENT_TYPE = {
  "application/typescript": "ts",
  "text/tsx": "tsx",
  "application/javascript": "js",
  "text/jsx": "jsx",
  "application/json": "json",
  "application/wasm": "wasm",
} as const;

export const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const MIN_LEN = 1;
export const MAX_LEN = 6;

export const ALIAS_NAME_REGEX = /[a-zA-Z0-9-_]+/;
export const ALIAS_TAG_REGEX = /[a-zA-Z0-9-_\.]+/;

export const ALIAS_NAME_REGEX_TEST = new RegExp(`^${ALIAS_NAME_REGEX.source}$`);
export const ALIAS_TAG_REGEX_TEST = new RegExp(`^${ALIAS_TAG_REGEX.source}$`);

export const ID_PATH =
  `:id([${BASE58_ALPHABET}]{${MIN_LEN},${MAX_LEN}}):ext((?:\\.(?:${
    EXTENSIONS.join("|")
  }))?)`;
export const ALIAS_PATH =
  `:alias(${ALIAS_NAME_REGEX.source})@:tag(${ALIAS_TAG_REGEX.source}):ext((?:\\.(?:${
    EXTENSIONS.join("|")
  }))?)`;

export const S3_BUCKET = Deno.env.get("S3_BUCKET")!;
export const DYNAMO_ALIAS_TABLE = Deno.env.get("DYNAMO_ALIAS_TABLE")!;
export const DYNAMO_USER_TABLE = Deno.env.get("DYNAMO_USER_TABLE")!;

export const S3_REGION = Deno.env.get("S3_REGION")!;
export const S3_ACCESS_KEY_ID = Deno.env.get("S3_ACCESS_KEY_ID")!;
export const S3_SECRET_ACCESS_KEY = Deno.env.get("S3_SECRET_ACCESS_KEY")!;

export const DYNAMO_REGION = Deno.env.get("DYNAMO_REGION")!;
export const DYNAMO_ACCESS_KEY_ID = Deno.env.get("DYNAMO_ACCESS_KEY_ID")!;
export const DYNAMO_SECRET_ACCESS_KEY = Deno.env.get(
  "DYNAMO_SECRET_ACCESS_KEY",
)!;

export const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID")!;
export const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET")!;
export const GITHUB_CALLBACK_URL = Deno.env.get("GITHUB_CALLBACK_URL");
