import { Match, Status } from "../../deps.ts";
import { ALIAS_NAME_REGEX_TEST } from "../../util/constants.ts";
import {
  couldNotAuthenticate,
  created,
  error,
  invalidAlias,
  invalidMethod,
} from "../../util/responses.ts";
import { authenticate } from "../../util/user.ts";
import { getAlias, pushRequest } from "../../util/alias.ts";

export async function request(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { alias, user, secret } = await req.json();

  if (!await authenticate(user, secret)) {
    return couldNotAuthenticate();
  }

  if (!ALIAS_NAME_REGEX_TEST.test(alias)) {
    return invalidAlias();
  }

  const item = await getAlias(alias);

  if (item) {
    return error("Alias already exists", Status.BadRequest);
  }

  try {
    await pushRequest({
      alias,
      owner: user,
      tags: {},
    });
  } catch (err) {
    console.log(err);
    return error("Alias request failed", Status.BadRequest);
  }

  return created();
}
