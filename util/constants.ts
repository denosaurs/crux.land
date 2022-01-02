// Max file size (20000 bytes / 20 kB)
export const MAX_SIZE = 2000 * 10;

export const EXTENSIONS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  // "mjs",
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
