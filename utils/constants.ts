// Max file size (32000 bytes / 32 kB)
export const MAX_SCRIPT_SIZE = 32000;

export const EXTENSIONS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "json",
  // "wasm",
];

export const CONTENT_TYPE_FROM_EXTENSION: Record<string, string> = {
  "ts": "application/typescript",
  "tsx": "text/tsx",
  "js": "application/javascript",
  "jsx": "text/jsx",
  "mjs": "application/javascript",
  "cjs": "application/javascript",
  "json": "application/json",
  "wasm": "application/wasm",
};

export const EXTENSION_FROM_CONTENT_TYPE: Record<string, string> = {
  "application/typescript": "ts",
  "video/vnd.dlna.mpeg-tts": "ts",
  "text/tsx": "tsx",
  "application/javascript": "js",
  "text/jsx": "jsx",
  "application/json": "json",
  "application/wasm": "wasm",
};

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
