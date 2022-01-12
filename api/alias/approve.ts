import { Match, Status } from "../../deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
  invalidMethod,
} from "../../util/responses.ts";
import { authenticate } from "../../util/user.ts";
import { approveRequest } from "../../util/alias.ts";

export async function approve(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { owner, alias, user, secret } = await req.json();

  if (!await authenticate(user, secret, true)) {
    return couldNotAuthenticate();
  }

  try {
    await approveRequest(owner, alias);
  } catch (err) {
    console.log(err);
    return error("Alias approval failed", Status.BadRequest);
  }

  return created();
}
