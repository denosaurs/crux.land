import { HandlerContext, Status } from "../../../server_deps.ts";
import { authenticate } from "../../../util/user.ts";
import {
  couldNotAuthenticate,
  created,
  error,
  invalidAlias,
} from "../../../util/responses.ts";
import { ALIAS_NAME_REGEX_TEST } from "../../../util/constants.ts";
import { getAlias, pushRequest } from "../../../util/alias.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { alias, user, secret } = await ctx.req.json();

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

    const { $metadata: { httpStatusCode } } = await pushRequest({
      alias,
      owner: user,
      tags: {},
    });
    if (httpStatusCode !== Status.OK) {
      return error("Alias request failed", Status.BadRequest);
    }

    return created();
  },
};
