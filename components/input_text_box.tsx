/** @jsx h */
import { h, JSX, tw } from "../deps.ts";
import { BORDER_CLASSES } from "./layout.tsx";

export function InputTextBox(
  { ...props }: {
    props: JSX.HTMLAttributes<HTMLLabelElement>;
  },
) {
  return (
    <input
      {...props}
      type="text"
      class={tw`
        w-full
        flex
        justify-center
        text-center
        cursor-text
        py-2 px-4
        ${BORDER_CLASSES}
        font-medium
        text-gray-700
        bg-gray-100
        transition
        duration-150
        ease-in-out
        hover:(text-gray-500 bg-gray-50)
        active:(bg-gray-100 text-gray-700)
        focus:(outline-none shadow border-blue-300)`}
    />
  );
}
