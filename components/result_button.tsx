import { h } from "../deps.ts";

export function ResultButton({ children, ...props }: { children: any }) {
  return (
    <div
      {...props}
      className="w-full hidden justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 transition duration-150 ease-in-out"
    >
      {children}
    </div>
  );
}
