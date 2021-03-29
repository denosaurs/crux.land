import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { CodeInline } from "../components/code_inline.tsx";
import { Endpoint } from "../components/endpoint.tsx";

export function Api() {
  return (
    <Layout title="crux.land" header>
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
              upload a file. Body must be a{" "}
              <CodeInline>
                multipart/form-data
              </CodeInline>, where a file must be present under the{" "}
              <CodeInline>'file'</CodeInline> key.
            </Endpoint>
          </div>
        </div>
      </Block>
    </Layout>
  );
}
