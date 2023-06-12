import "$std/dotenv/load.ts";
import { z } from "zod";

export const development =
  typeof Deno.env.get("DENO_DEPLOYMENT_ID") === "undefined" ||
  Deno.env.get("ENVIRONMENT") === "DEVELOPMENT" ||
  Deno.env.get("ENVIRONMENT") !== "PRODUCTION";

export const schema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string().url().optional(),
});

export const config = schema.parse(Deno.env.toObject());
