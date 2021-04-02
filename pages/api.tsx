import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { CodeInline } from "../components/code_inline.tsx";
import { Endpoint } from "../components/endpoint.tsx";

export function Api() {
  return (
    <Layout title="crux.land" description>
      <Block>
        <div className="flex flex-col lg:flex-row">
          <div className="inset-y-0 left-0 w-full px-8">
            <div className="text-lg font-medium mb-4">
              All endpoints are under the <CodeInline>/api</CodeInline> endpoint
            </div>
            <Endpoint method="GET" path="/get/:id">
              returns the file associated with the id, optionally takes a file
              extension
            </Endpoint>
            <Endpoint method="GET" path="/get/:alias@:tag">
              returns the file associated with the alias and tag, optionally
              takes a file extension
            </Endpoint>
            <Endpoint method="POST" path="/add">
              upload a script. Mime type must be{"  "}
              <CodeInline>
                application/json
              </CodeInline>{" "}
              and the body a json object, where the name of the script with
              extension is provided as a string under the{" "}
              <CodeInline>'name'</CodeInline>{" "}
              key and it's content base64 encoded as a string under the{" "}
              <CodeInline>'content'</CodeInline> key
            </Endpoint>
          </div>
        </div>
      </Block>
    </Layout>
  );
}
