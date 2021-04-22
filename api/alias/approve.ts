import { Status } from "../../deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
  invalidMethod,
} from "../../util/responses.ts";
import { Match } from "../../util/router.ts";
import { authenticate } from "../../util/user.ts";
import { approveRequest } from "../../util/alias.ts";

export async function approve(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { index, user, secret } = await req.json();

  if (!await authenticate(user, secret, true)) {
    return couldNotAuthenticate();
  }

  const { $metadata: { httpStatusCode } } = await approveRequest(index);
  if (httpStatusCode !== Status.OK) {
    return error("Alias approval failed", Status.BadRequest);
  }

  return created();
}