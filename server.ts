import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { fnv1a } from "./hash.ts";
import { decode, encode } from "./base58.ts";

const scripts = new Map<number, string>();

const app = new Application();
const router = new Router();

router
  .get("/:id", (context) => {
    if (context.params?.id) {
      try {
        const id = decode(context.params?.id);
        const file = scripts.get(id);

        if (file) {
          context.response.body = file;
        }
      } catch (e) {
        if (e === "base58InvalidDecode") {
        }
      }
    }
  })
  .post("/add", async (context) => {
    const body = context.request.body({
      type: "text",
    });

    const data = await body.value;
    const id = fnv1a(data) + Date.now();

    if (!scripts.has(id)) {
      scripts.set(id, data);

      context.response.body = encode(id);
    } else {
      // TODO
    }
  });

app.use(router.routes());

await app.listen({port: 8000});
