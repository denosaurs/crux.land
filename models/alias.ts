import { kv } from "~/utils/kv.ts";

export interface Alias {
  name: string;
  owner: string;
}

export async function createAlias(alias: Alias): Promise<Alias> {
  const res = await kv
    .atomic()
    .check({ key: ["alias", alias.name], versionstamp: null })
    .check({
      key: ["alias_by_user", alias.owner, alias.name],
      versionstamp: null,
    })
    .set(["alias", alias.name], alias)
    .set(["alias_by_user", alias.owner, alias.name], alias)
    .commit();

  if (!res.ok) {
    throw new Error(`Alias with name ${alias.name} already exists`);
  }

  return alias;
}
