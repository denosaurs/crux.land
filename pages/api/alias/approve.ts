import { HandlerContext, Status } from "../../../server_deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
} from "../../../util/responses.ts";
import { approveRequest } from "../../../util/alias.ts";
import { authenticate } from "../../../util/user.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { owner, alias, user, secret } = await ctx.req.json();

    if (!await authenticate(user, secret, true)) {
      return couldNotAuthenticate();
    }

    const { $metadata: { httpStatusCode } } = await approveRequest(
      owner,
      alias,
    );
    if (httpStatusCode !== Status.OK) {
      return error("Alias approval failed", Status.BadRequest);
    }

    return created();
  },
};
