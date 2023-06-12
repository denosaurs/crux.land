import { session } from "~/middlewares/session.ts";

export const handler = [
  session(),
];
