import { Status } from "../../deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
  invalidMethod,
} from "../../util/responses.ts";
import { Match } from "../../util/router.ts";
import { authenticate } from "../../util/user.ts";
import { denyRequest } from "../../util/alias.ts";

export async function deny(
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

  const { $metadata: { httpStatusCode } } = await denyRequest(owner, alias);
  if (httpStatusCode !== Status.OK) {
    return error("Alias denial failed", Status.BadRequest);
  }

  return created();
}
