import {
  couldNotAuthenticate,
  invalidMethod,
  json,
} from "../../util/responses.ts";
import { Match } from "../../deps.ts";
import { authenticate } from "../../util/user.ts";
import { getRequests } from "../../util/alias.ts";

export async function requests(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { user, secret } = await req.json();

  if (!await authenticate(user, secret, true)) {
    return couldNotAuthenticate();
  }

  return json(await getRequests());
}
