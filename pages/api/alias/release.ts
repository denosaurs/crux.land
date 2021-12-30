import { HandlerContext, Status } from "../../../server_deps.ts";
import {
  aliasNotFound,
  couldNotAuthenticate,
  created,
  error,
  notFound,
} from "../../../util/responses.ts";
import { getAlias, putAlias } from "../../../util/alias.ts";
import { authenticate } from "../../../util/user.ts";
import {
  ALIAS_NAME_REGEX_TEST,
  ALIAS_TAG_REGEX_TEST,
} from "../../../util/constants.ts";
import { S3_CLIENT } from "../../../util/clients.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { alias, user, secret, tag, script } = await ctx.req.json();

    if (!await authenticate(user, secret)) {
      return couldNotAuthenticate();
    }

    if (!ALIAS_NAME_REGEX_TEST.test(alias)) {
      return error("Invalid alias format", Status.BadRequest);
    }

    if (!ALIAS_TAG_REGEX_TEST.test(tag)) {
      return error("Invalid tag format", Status.BadRequest);
    }

    const file = await S3_CLIENT.headObject(script);

    if (file === undefined) {
      return notFound();
    }

    const item = await getAlias(alias);

    if (item === undefined) {
      return aliasNotFound();
    }

    if (item.owner !== user) {
      return error("You are not the owner of this alias", Status.Unauthorized);
    }

    if (item.tags[tag] !== undefined) {
      return error("Tag already exists", Status.BadRequest);
    }

    item.tags[tag] = script;

    const { $metadata: { httpStatusCode } } = await putAlias(item);

    if (httpStatusCode !== Status.OK) {
      return error("Release failed", Status.BadRequest);
    }

    return created();
  },
};