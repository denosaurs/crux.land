import { kv } from "~/utils/kv.ts";
import { EXTENSION_FROM_CONTENT_TYPE } from "../utils/constants.ts";

export interface Script {
  id: string;
  author?: string;
  code: Uint8Array;
  contentType: keyof typeof EXTENSION_FROM_CONTENT_TYPE;
}

export async function createScript(script: Script): Promise<Script> {
  const res = await kv
    .atomic()
    .check({ key: ["script", script.id], versionstamp: null })
    .set(["script", script.id], script)
    .commit();

  if (!res.ok) {
    throw new Error(`Script with id ${script.id} already exists`);
  }

  return script;
}

export async function getScript(id: string): Promise<Script | null> {
  const key = ["script", id];

  return (
    (await kv.get<Script>(key, { consistency: "eventual" })).value ??
      (await kv.get<Script>(key, { consistency: "strong" })).value
  );
}
