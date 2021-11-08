import { HandlerContext, Status } from "../../../server_deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
} from "../../../util/responses.ts";
import { denyRequest } from "../../../util/alias.ts";
import { authenticate } from "../../../util/user.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { owner, alias, user, secret } = await ctx.req.json();

    if (!await authenticate(user, secret, true)) {
      return couldNotAuthenticate();
    }

    const { $metadata: { httpStatusCode } } = await denyRequest(owner, alias);
    if (httpStatusCode !== Status.OK) {
      return error("Alias denial failed", Status.BadRequest);
    }

    return created();
  },
};
