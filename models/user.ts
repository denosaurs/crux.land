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
    .set(["user_by_name", user.name], user)
    .commit();

  if (!res.ok) {
    throw new Error(`User with id ${user.id} already exists`);
  }

  return user;
}

export async function readUser(id: string): Promise<User | null> {
  return (await kv.get<User>(["user", id])).value;
}
