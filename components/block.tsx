import { ComponentChildren } from "preact";

export function Block({ children }: { children: ComponentChildren }) {
  return (
    <div class="max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mt-4">
      {children}
    </div>
  );
}
