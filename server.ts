import { Application, Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { fnv1a } from "./hash.ts";
import { decode, encode } from "./base58.ts";

const scripts = new Map<number, Uint8Array>();

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
      type: "form-data",
    });

    const form = await body.value.read({
      maxSize: 10_000,
      maxFileSize: 10_000,
    });
    const file = form.files?.[0];

    if (file) {
      const id = fnv1a(file.content!) + Date.now();

      if (!scripts.has(id)) {
        console.log(file.contentType);
        scripts.set(id, file.content!);

        context.response.body = encode(id);
      } else {
        // TODO: collision
      }
    } else {
      // file missing or too large
      context.response.status = 400;
    }
  });

app.use(router.routes());

await app.listen({port: 8000});
