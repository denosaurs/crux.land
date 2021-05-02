import { invalidMethod, json } from "../../util/responses.ts";
import { Match } from "../../deps.ts";
import { listAliases } from "../../util/alias.ts";

export async function list(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { user } = await req.json();

  return json(await listAliases(user));
}
