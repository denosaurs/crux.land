import {
  FormFile,
  MultipartReader,
  S3Bucket,
  ServerRequest,
  status,
} from "../deps.ts";
import { EXTENSIONS, MAX_SIZE } from "../util/constants.ts";
import { getBoundry } from "../util/util.ts";
import { encode } from "../util/base58.ts";
import { fnv1a } from "../util/fnv1a.ts";
import { badFileFormat, fileTooLarge, invalidExt } from "../util/responses.ts";

export default async (req: ServerRequest) => {
  if (req.method !== "POST") {
    req.respond({ status: status.BAD_REQUEST });
  }

  const reader = new MultipartReader(req.body, getBoundry(req.headers));

  const form = await reader.readForm();
  const file = form.file("file");

  if (file instanceof Array || file === undefined) {
    return badFileFormat(req);
  }

  if (file.size > MAX_SIZE) {
    return fileTooLarge(req);
  }

  if (!EXTENSIONS.some((ext) => file.filename.endsWith(ext))) {
    return invalidExt(req);
  }

  const bucket = new S3Bucket({
    region: Deno.env.get("S3_REGION")!,
    accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  });

  const id = await addFile(bucket, file);

  return req.respond({
    status: status.OK,
    body: id,
  });
};

async function addFile(bucket: S3Bucket, file: FormFile): Promise<string> {
  const id = (fnv1a(file.content!) + Date.now()).toString();

  const script = await bucket.getObject(id); // temporary
  if (!script) {
    await bucket.putObject(id, file.content!, {
      contentType: EXTENSIONS.slice(0, 3).some((ext) =>
          file.filename.endsWith(ext)
        )
        ? "application/typescript"
        : "application/javascript",
    });

    return encode(+id);
  } else {
    return await addFile(bucket, file);
  }
}
