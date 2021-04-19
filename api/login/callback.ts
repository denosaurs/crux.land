import { GetItemCommand, PutItemCommand, Status } from "../../deps.ts";
import {
  DYNAMO_USER_TABLE,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../../util/constants.ts";
import {
  authError,
  couldNotCreateUser,
  invalidGithubCode,
  json,
} from "../../util/responses.ts";
import { Match } from "../../util/router.ts";
import { DYNAMO_CLIENT } from "../../util/clients.ts";
import { generate } from "../../util/token.ts";

export async function callback(
  req: Request,
  _match: Match,
): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code === null) {
    return invalidGithubCode();
  }

  const reqUrl = new URL(
    `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
  );
  reqUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  reqUrl.searchParams.set("client_secret", GITHUB_CLIENT_SECRET);
  reqUrl.searchParams.set("code", code);

  const token = await (await fetch(reqUrl.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  })).json();

  if (token.error !== undefined) {
    return authError(token);
  }

  const user = await (await fetch("https://api.github.com/user", {
    headers: {
      authorization: `token ${token.access_token}`,
      accept: "application/json",
    },
  })).json();

  if (user.message !== undefined) {
    return authError(token);
  }

  // @ts-ignore TS2339
  const { Item: item } = await DYNAMO_CLIENT.send(
    new GetItemCommand({
      TableName: DYNAMO_USER_TABLE,
      Key: {
        id: { N: user.id.toString() },
      },
    }),
  );

  if (item) {
    return json({ secret: item.secret?.S });
  }

  const secret = generate();

  // @ts-ignore TS2339
  const { $metadata: { httpStatusCode } } = await DYNAMO_CLIENT.send(
    new PutItemCommand({
      TableName: DYNAMO_USER_TABLE,
      Item: {
        id: { N: user.id.toString() },
        secret: { S: secret },
        admin: { BOOL: false },
      },
    }),
  );

  if (httpStatusCode !== Status.OK) {
    return couldNotCreateUser();
  }

  return json({ secret });
}
