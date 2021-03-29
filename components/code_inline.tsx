import { h, JSX } from "../deps.ts";

export function CodeInline({ children }: { children: JSX.Element }) {
  return (
    <span className="font-mono bg-gray-200 rounded px-1">{children}</span>
  );
}
