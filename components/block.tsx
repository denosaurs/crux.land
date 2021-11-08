/** @jsx h */
import { ComponentChildren, h, tw } from "../deps.ts";

export function Block({ children }: { children: ComponentChildren }) {
  return (
    <div class={tw`max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mt-4`}>
      {children}
    </div>
  );
}
