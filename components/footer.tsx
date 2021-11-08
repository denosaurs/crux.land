/** @jsx h */
import {
  faDiscord,
  faGithub,
  faTwitter,
  FontAwesomeIcon,
  h,
  tw,
} from "../deps.ts";

export function Footer() {
  return (
    <div
      class={tw
        `max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8`}
    >
      <div class={tw`mt-5 flex justify-center`}>
        <a class={tw`text-base leading-6 text-gray-500`}>
          © 2020-2021 Denosaurs
        </a>
      </div>
      <div class={tw`mt-5 flex justify-center`}>
        <a
          href="https://github.com/denosaurs"
          class={tw`text-gray-400 hover:text-gray-500`}
        >
          <span class={tw`sr-only`}>GitHub</span>
          <FontAwesomeIcon className={tw`h-6 w-6`} icon={faGithub} />
        </a>
        <a
          href="https://discord.gg/BwjyWsSUDf"
          class={tw`ml-6 text-gray-400 hover:text-gray-500`}
        >
          <span class={tw`sr-only`}>Discord</span>
          <FontAwesomeIcon className={tw`h-6 w-6`} icon={faDiscord} />
        </a>
        <a
          href="https://twitter.com/denosaurs"
          class={tw`ml-6 text-gray-400 hover:text-gray-500`}
        >
          <span class={tw`sr-only`}>Twitter</span>
          <FontAwesomeIcon className={tw`h-6 w-6`} icon={faTwitter} />
        </a>
      </div>
    </div>
  );
}
