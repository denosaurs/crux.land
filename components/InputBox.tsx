import { ComponentChildren, JSX } from "preact";
import { BORDER_CLASSES } from "~/components/Layout.tsx";

export function InputBox(
  { children, ...props }: {
    children?: ComponentChildren;
    props?: JSX.HTMLAttributes<HTMLInputElement>;
  },
) {
  return (
    <input
      {...props}
      class="w-full flex justify-center cursor-pointer py-2 px-4 ${BORDER_CLASSES} font-medium text-gray-700 bg-gray-100 transition duration-150 ease-in-out hover:(text-gray-500 bg-gray-50) active:(bg-gray-100 text-gray-700) focus:(outline-none shadow border-blue-300)"
    >
      {children}
    </input>
  );
}
