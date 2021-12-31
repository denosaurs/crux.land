/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "https://raw.githubusercontent.com/lucacasonato/fresh/d967088bbcea93b5537db4e98e34e78c34a63b2c/server.ts";
import routes from "./routes.gen.ts";

await start(routes);
