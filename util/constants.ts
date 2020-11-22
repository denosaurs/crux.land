export const MAX_SIZE = 10000;
export const EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
] as const;
export const CONTENT_TYPE_FROM_EXTENSION: {
  [ext in typeof EXTENSIONS[number]]: string;
} = {
  ".ts": "application/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".mjs": "application/javascript",
  ".cjs": "application/javascript",
};
export const EXTENSION_FROM_CONTENT_TYPE: {
  [type: string]: typeof EXTENSIONS[number];
} = {
  "application/typescript": ".ts",
  "text/tsx": ".tsx",
  "application/javascript": ".js",
  "text/jsx": ".jsx",
};
