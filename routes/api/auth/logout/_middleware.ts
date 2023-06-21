import { authenticated } from "~/middlewares/authenticated.ts";

export const handler = [
  authenticated(),
];
