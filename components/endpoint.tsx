import { ComponentChildren } from "preact";
import { ApiBody, ApiTable } from "~/components/ApiTable.tsx";

export function Endpoint({
  children,
  method,
  path,
  requestBody,
  responseBody,
}: {
  children: ComponentChildren;
  method: string;
  path: string;
  requestBody?: ApiBody;
  responseBody?: ApiBody;
}) {
  return (
    <div class="mb-7">
      <span class="text-lg font-semibold font-mono">
        <span class="text-yellow-600">{method}</span>{" "}
        <span class="text-gray-700">{path}</span>
      </span>
      <br />
      {requestBody && <ApiTable {...requestBody} />}
      {children}
      {responseBody && <ApiTable {...responseBody} />}
    </div>
  );
}
