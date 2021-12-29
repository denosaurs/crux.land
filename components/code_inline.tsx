import { ComponentChildren, h } from "../deps.ts";

export function CodeInline({ children }: { children: ComponentChildren }) {
  return <span class="font-mono bg-gray-200 rounded px-1">{children}</span>;
}
