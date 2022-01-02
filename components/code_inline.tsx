/** @jsx h */
import { ComponentChildren, h, tw } from "../deps.ts";

export function CodeInline({ children }: { children: ComponentChildren }) {
  return <span class={tw`font-mono bg-gray-200 rounded px-1`}>{children}</span>;
}
