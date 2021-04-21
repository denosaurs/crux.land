import { Status } from "../deps.ts";
import { EXTENSION_FROM_CONTENT_TYPE } from "../util/constants.ts";
import { getIdFromAlias } from "../util/alias.ts";
import { invalidMethod, notFound, redirect } from "../util/responses.ts";
import { Match } from "../util/router.ts";
import { S3_CLIENT } from "../util/clients.ts";

export async function getAlias(
  req: Request,
  match: Match,
): Promise<Response> {
  if (req.method !== "GET") {
    return invalidMethod();
  }

  const { alias, tag, ext } = match.params as {
    alias: string;
    tag: string;
    ext: string | undefined;
  };

  const id = await getIdFromAlias(alias, tag);

  if (id === undefined) {
    return notFound();
  }

  return redirect(`/api/get/${id}${ext}`);
}

export async function getId(
  req: Request,
  match: Match,
): Promise<Response> {
  if (req.method !== "GET") {
    return invalidMethod();
  }

  const { id, ext } = match.params as { id: string; ext: string | undefined };

  if (ext === "" || ext === undefined) {
    const file = await S3_CLIENT.headObject(id);

    if (file === undefined) {
      return notFound();
    }

    return redirect(`/api/get/${id}.${
      EXTENSION_FROM_CONTENT_TYPE[
        file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
      ]
    }`);
  }

  const file = await S3_CLIENT.getObject(id);

  if (file === undefined) {
    return notFound();
  }

  return new Response(file.body, {
    status: Status.OK,
    headers: new Headers({
      "Content-Type": `${file.contentType!}; charset=utf-8`,
    }),
  });
}
