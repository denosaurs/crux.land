import { kv } from "~/utils/kv.ts";

export type UserRole = "admin" | "member";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  verified: boolean;
}

export async function createUser(user: User): Promise<User> {
  const res = await kv
    .atomic()
    .check({ key: ["user", user.id], versionstamp: null })
    .check({ key: ["user_by_name", user.name], versionstamp: null })
    .set(["user", user.id], user)
    .set(["user_by_name", user.name], user.id)
    .commit();

  if (!res.ok) {
    throw new Error(`User with id ${user.id} already exists`);
  }

  return user;
}

export async function getUser(id: string): Promise<User | null> {
  return (await kv.get<User>(["user", id])).value;
}

export async function getUserByName(name: string): Promise<User | null> {
  const id = (await kv.get<string>(["user_by_name", name])).value;
  
  if (id == null) {
    return null;
  }

  return await getUser(id);
}
