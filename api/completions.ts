import { GetItemCommand, ScanCommand } from "../deps.ts";
import {
  ALIAS_NAME_REGEX,
  ALIAS_TAG_REGEX,
  DYNAMO_ALIAS_TABLE,
} from "../util/constants.ts";
import { DYNAMO_CLIENT } from "../util/clients.ts";
import { Match } from "../util/router.ts";

export async function completionsAlias(): Promise<Response> {
  // @ts-ignore TS2339
  const { Items: items } = await DYNAMO_CLIENT.send(
    new ScanCommand({
      TableName: DYNAMO_ALIAS_TABLE,
    }),
  );

  return new Response(JSON.stringify(items.map((item) => item.alias.S)), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function completionsTags(
  req: Request,
  matches: Match,
): Promise<Response> {
  // @ts-ignore TS2339
  const { Item: item } = await DYNAMO_CLIENT.send(
    new GetItemCommand({
      TableName: DYNAMO_ALIAS_TABLE,
      Key: {
        alias: { S: matches.params.alias },
      },
    }),
  );

  return new Response(JSON.stringify(Object.keys(item.tags.M)), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function completionsSchema(): Response {
  return new Response(
    JSON.stringify({
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
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
