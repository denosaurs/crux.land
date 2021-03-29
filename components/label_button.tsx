import { h } from "../deps.ts";

export function LabelButton({ children, ...props }: { children: any }) {
  return (
    <label
      {...props}
      className="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 select-none"
    >
      {children}
    </label>
  );
}
