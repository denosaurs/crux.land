import { kv } from "../utils/kv.ts";

export interface Session {
  id: string;
  user: string;
  note?: string;
  expires?: Date;
}

export async function upsertSession(session: Session): Promise<void> {
  const res = await kv
    .atomic()
    .set(["session", session.id], session)
    .set(["session_by_user", session.user, session.id], session)
    .commit();

  if (!res.ok) {
    throw new Error(
      `Failed to upsert session ${session.id} for user ${session.user}`,
    );
  }
}

export async function createSession(
  user: string,
  note: string,
  expires?: Date,
): Promise<Session> {
  const id = crypto.randomUUID();
  const session = {
    id,
    user,
    note,
    expires,
  } satisfies Session;

  await upsertSession(session);

  return session;
}

export async function getSession(id: string): Promise<Session | null> {
  const key = ["session", id];
  return (
    (await kv.get<Session>(key, { consistency: "eventual" })).value ??
      (await kv.get<Session>(key, { consistency: "strong" })).value
  );
}

export async function listUserSessions(user: string): Promise<Session[]> {
  const sessions = [];

  for await (
    const session of kv.list<Session>({
      prefix: ["session_by_user", user],
    })
  ) {
    sessions.push(session.value);
  }

  return sessions;
}

export async function pruneSessions(): Promise<boolean> {
  const operations = kv.atomic();
  const now = new Date();

  for await (
    const { value: session } of kv.list<Session>({
      prefix: ["session"],
    })
  ) {
    if (session.expires && session.expires <= now) {
      operations
        .delete(["session", session.id])
        .delete(["session_by_user", session.user, session.id]);
    }
  }

  return (await operations.commit()).ok;
}

export async function pruneUserSessions(user: string): Promise<boolean> {
  const operations = kv.atomic();
  const now = new Date();

  for await (
    const { value: session } of kv.list<Session>({
      prefix: ["session_by_user", user],
    })
  ) {
    if (session.expires && session.expires <= now) {
      operations
        .delete(["session", session.id])
        .delete(["session_by_user", session.user, session.id]);
    }
  }

  return (await operations.commit()).ok;
}

export async function deleteSession(session: Session): Promise<boolean> {
  return (
    await kv
      .atomic()
      .delete(["session", session.id])
      .delete(["session_by_user", session.user, session.id])
      .commit()
  ).ok;
}
