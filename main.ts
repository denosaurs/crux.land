/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "/Users/crowlkats/projects/fresh/server.ts";
import routes from "./routes.gen.ts";

await start(routes);

/*
paths left to do:

"/api/alias/request": request,
"/api/alias/release": release,
"/api/alias/requests": requests,
 */
