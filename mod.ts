import { add } from "./api/add.ts";
import { get } from "./api/get.ts";

addEventListener("fetch", (e: any) => {
  const path = new URL(e.request.url, "https://crux.land").pathname;

  let res!: Response | Promise<Response>;
  if (path.startsWith("/api/add/")) {
    res = add(e.request);
  } else if (path.startsWith("/api/get/")) {
    res = get(e.request);
  } else if (path === "/") {
    res = new Response(Deno.readTextFileSync("./index.html"));
  } else {
    res = get(e.request);
  }

  e.respondWith(res);
});
