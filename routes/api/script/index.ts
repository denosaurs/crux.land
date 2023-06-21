import { Handlers, Status } from "$fresh/server.ts";
import * as bytes from "$std/fmt/bytes.ts";
import { extname } from "$std/path/mod.ts";

import { SessionState } from "~/middlewares/session.ts";
import { createScript, getScript } from "~/models/script.ts";
import * as base58 from "~/utils/base58.ts";
import { fnv1a } from "~/utils/fnv1a.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSION_FROM_CONTENT_TYPE,
  EXTENSIONS,
  MAX_SCRIPT_SIZE,
} from "~/utils/constants.ts";
import { encode } from "~/utils/util.ts";

export const handler: Handlers<unknown, SessionState> = {
  async POST(req, ctx) {
    const author = ctx.state.session?.valid
      ? ctx.state.session.user
      : undefined;
    const formData = await req.formData();

    const file = formData.get("file");

    if (file == null) {
      return Response.json(
        {
          message: "Expected multipart/form-data containing the property file",
        },
        { status: Status.BadRequest },
      );
    }

    if (!(file instanceof File)) {
      return Response.json(
        { message: "Expected the file property to be a file" },
        { status: Status.BadRequest },
      );
    }

    if (file.size === 0) {
      return Response.json(
        {
          message: "File cannot be empty",
        },
        { status: Status.BadRequest },
      );
    }

    if (file.size > MAX_SCRIPT_SIZE) {
      return Response.json(
        {
          message: `File is too large, max size is ${
            bytes.format(MAX_SCRIPT_SIZE)
          }`,
        },
        { status: Status.RequestEntityTooLarge },
      );
    }

    let extension: string | null = extname(file.name);

    if (extension.startsWith(".")) {
      extension = extension.slice(1);
    }

    if (extension === "") {
      extension = EXTENSION_FROM_CONTENT_TYPE[file.type];
    }

    if (extension == null) {
      return Response.json(
        { message: "Could not determine media type of file" },
        { status: Status.UnsupportedMediaType },
      );
    }

    if (!EXTENSIONS.includes(extension)) {
      return Response.json(
        {
          message:
            `Unsupported media type ${extension}, supported extensions are ${
              EXTENSIONS.join(
                ", ",
              )
            }`,
        },
        { status: Status.UnsupportedMediaType },
      );
    }

    const content = await file.text();
    const contentType = CONTENT_TYPE_FROM_EXTENSION[extension];
    const id = base58.encode(fnv1a(encode(content)));

    try {
      await createScript({
        id,
        author,
        content,
        extension,
        contentType,
      });

      return Response.json({ id }, { status: Status.Created });
    } catch (error) {
      const exists = (await getScript(id)) !== null;

      if (exists) {
        return Response.json(
          {
            message: `A script with the id ${id} already exists`,
          },
          { status: Status.Conflict },
        );
      }

      console.error(error);
      return Response.json(
        {
          message: "Failed to create script",
        },
        { status: Status.InternalServerError },
      );
    }
  },
};
