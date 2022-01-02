/** @jsx h */
import { ComponentChildren, h, JSX, tw } from "../deps.ts";
import { BORDER_CLASSES } from "./layout.tsx";

export function ResultBox(
  { children, ...props }: {
    children: ComponentChildren;
    props?: JSX.HTMLAttributes<HTMLDivElement>;
  },
) {
  return (
    <div
      {...props}
      class={tw`
        w-full
        flex
        justify-center
        py-2
        px-4
        ${BORDER_CLASSES}
        font-medium
        text-gray-700
        bg-gray-100
        transition
        duration-150
        ease-in-out`}
    >
      {children}
    </div>
  );
}
