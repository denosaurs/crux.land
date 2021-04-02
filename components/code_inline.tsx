import { ComponentChildren, h } from "../deps.ts";

export function CodeInline({ children }: { children: ComponentChildren }) {
  return (
    <span className="font-mono bg-gray-200 rounded px-1">{children}</span>
  );
}
