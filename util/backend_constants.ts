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
