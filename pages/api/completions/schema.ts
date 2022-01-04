import { HandlerContext } from "../../../server_deps.ts";
import { PageConfig } from "../../../deps.ts";
import { json } from "../../../util/responses.ts";
import { ALIAS_NAME_REGEX, ALIAS_TAG_REGEX } from "../../../util/constants.ts";

export const handler = {
  GET(_: HandlerContext): Response {
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
    }, {
      headers: {
        "cache-control": "max-age=86400",
      }
    });
  },
};

export const config: PageConfig = {
  routeOverride: "/.well-known/deno-import-intellisense.json",
};
