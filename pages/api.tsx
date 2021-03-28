import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";

export function Api() {
  return (
    <Layout title="crux.land" header>
      <Block>
        <div className="flex flex-col lg:flex-row">
          <div className="inset-y-0 left-0 w-full px-8">
            <span className="text-lg font-medium">
              All endpoints are under the{" "}
              <span className="font-mono bg-gray-200 rounded px-1">/api</span>
              {" "}
              endpoint
            </span>
            <br />
            <br />
            <Endpoint method="GET" path="/get/:id">
              returns the file with given name or alias.
            </Endpoint>
            <br />
            <Endpoint method="POST" path="/add">
              upload a file. Body must be a{" "}
              <span className="font-mono bg-gray-200 rounded px-1">
                multipart/form-data
              </span>, where a file must be present under the{" "}
              <span className="font-mono bg-gray-200 rounded">'file'</span> key.
            </Endpoint>
          </div>
        </div>
      </Block>
    </Layout>
  );
}

function Endpoint(
  { method, path, children }: { method: string; path: string },
) {
  return (
    <div>
      <span className="text-lg font-semibold font-mono">
        <span className="text-yellow-600">{method}</span>{" "}
        <span className="text-gray-700">{path}</span>
      </span>
      <br />
      {children}
    </div>
  );
}
