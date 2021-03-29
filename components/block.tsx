import { h, JSX } from "../deps.ts";

export function Block({ children }: { children: JSX.Element }) {
  return (
    <div className="max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mt-4">
      {children}
    </div>
  );
}
