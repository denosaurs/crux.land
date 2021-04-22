import {
  ALIAS_NAME_REGEX,
  ALIAS_TAG_REGEX,
  DYNAMO_ALIAS_TABLE,
} from "../util/constants.ts";
import { DYNAMO_CLIENT } from "../util/clients.ts";
import { Match } from "../util/router.ts";
import { aliasNotFound, json } from "../util/responses.ts";
import { getAlias } from "../util/alias.ts";

export async function completionsAlias(): Promise<Response> {
  const { Items: items } = await DYNAMO_CLIENT.scan({
    TableName: DYNAMO_ALIAS_TABLE,
  });

  console.log(items);

  return json(items.map((item: { alias: { S: string } }) => item.alias.S));
}

export async function completionsTags(
  _req: Request,
  match: Match,
): Promise<Response> {
  const alias = await getAlias(match.params.alias!);

  if (alias === undefined) {
    return aliasNotFound();
  }

  return json(Object.keys(alias.tags));
}

export function completionsSchema(): Response {
  return json({
    version: 1,
    registries: [
      {
        schema:
          `/:module(${ALIAS_NAME_REGEX.source})@:tag(${ALIAS_TAG_REGEX.source})`,
        variables: [
          {
            key: "module",
            url: "https://crux.land/api/completions",
          },
          {
            key: "tag",
            url: "https://crux.land/api/completions/${module}/tags",
          },
        ],
      },
    ],
  });
}
