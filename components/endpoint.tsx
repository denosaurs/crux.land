import { ComponentChildren, h } from "../deps.ts";
import { ApiBody, ApiTable } from "./api_table.tsx";

export function Endpoint(
  { children, method, path, requestBody, responseBody }: {
    children: ComponentChildren;
    method: string;
    path: string;
    requestBody?: ApiBody;
    responseBody?: ApiBody;
  },
) {
  return (
    <div className="mb-7">
      <span className="text-lg font-semibold font-mono">
        <span className="text-yellow-600">{method}</span>{" "}
        <span className="text-gray-700">{path}</span>
      </span>
      <br />
      {requestBody && <ApiTable {...requestBody} />}
      {children}
      {responseBody && <ApiTable {...responseBody} />}
    </div>
  );
}
