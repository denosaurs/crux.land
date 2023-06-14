import { kv } from "~/utils/kv.ts";

export interface Script {
  id: string;
  author?: string;
  content: string;
  extension: string;
  contentType: string;
}

export async function createScript(script: Script): Promise<Script> {
  const operation = kv
    .atomic()
    .check({ key: ["script", script.id], versionstamp: null })
    .set(["script", script.id], script);

  if (script.author) {
    operation
      .set(["script_by_user", script.author, script.id], script);
  }

  const res = await operation.commit();

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

export async function listScripts(): Promise<Script[]> {
  const sessions = [];

  for await (
    const session of kv.list<Script>({ prefix: ["script"] })
  ) {
    sessions.push(session.value);
  }

  return sessions;
}

export async function listScriptsByUser(user: string): Promise<Script[]> {
  const sessions = [];

  for await (
    const session of kv.list<Script>({ prefix: ["script_by_user", user] })
  ) {
    sessions.push(session.value);
  }

  return sessions;
}
