import { h } from "../deps.ts";

export function Header() {
  return (
    <div
      className="max-w-screen-xl mx-auto px-4 pt-6 lg:pt-10 pb-3 lg:pb-6 flex flex-col items-center"
    >
      <h1
        className="font-bold text-4xl lg:text-5xl leading-10 tracking-tight text-gray-900"
      >
        crux.land
      </h1>
      <h2
        class="mt-4 lg:mt-5 font-light text-xl lg:text-2xl text-center leading-tight text-gray-900"
      >
        A <strong class="font-semibold">registry</strong> for{" "}
        <strong class="font-semibold">permanently</strong> hosting{" "}
        <strong class="font-semibold">small</strong> scripts
      </h2>
    </div>
  );
}
