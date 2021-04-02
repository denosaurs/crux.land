import { ComponentChildren, h } from "../deps.ts";

export function Endpoint(
  { children, method, path }: {
    children: ComponentChildren;
    method: string;
    path: string;
  },
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
