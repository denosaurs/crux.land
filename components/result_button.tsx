import { ComponentChildren, h, JSX } from "../deps.ts";

export function ResultButton(
  { children, ...props }: {
    children: ComponentChildren;
    props: JSX.HTMLAttributes<HTMLDivElement>;
  },
) {
  return (
    <div
      {...props}
      class="w-full hidden justify-center py-2 px-4 border border-gray-300 font-medium rounded-md text-gray-700 bg-gray-100 transition duration-150 ease-in-out"
    >
      {children}
    </div>
  );
}
