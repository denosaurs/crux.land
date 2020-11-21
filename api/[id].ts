import { ServerRequest, status } from "../deps.ts";

export default async (req: ServerRequest) => {
  if (req.method !== "GET") {
    req.respond({ status: status.BAD_REQUEST });
  }

  console.log(req);
};
