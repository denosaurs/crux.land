/** @jsx h */
import { ComponentChildren, h, tw } from "../deps.ts";
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
    <div class={tw`mb-7`}>
      <span class={tw`text-lg font-semibold font-mono`}>
        <span class={tw`text-yellow-600`}>{method}</span>{" "}
        <span class={tw`text-gray-700`}>{path}</span>
      </span>
      <br />
      {requestBody && <ApiTable {...requestBody} />}
      {children}
      {responseBody && <ApiTable {...responseBody} />}
    </div>
  );
}
