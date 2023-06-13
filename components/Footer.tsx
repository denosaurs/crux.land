import { FontAwesomeIcon, faGithub } from "../deps.ts";

export function Footer() {
    return (
      <div
        class="max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8"
      >
        <div class="mt-5 flex justify-center">
          <a class="text-base leading-6 text-gray-500">
            © 2020-2023 Denosaurs
          </a>
        </div>
        <div class="mt-5 flex justify-center">
          <a
            href="https://github.com/denosaurs"
            class="text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">GitHub</span>
            <FontAwesomeIcon className="h-6 w-6" icon={faGithub} />
          </a>
          <a
            href="https://discord.gg/BwjyWsSUDf"
            class="ml-6 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Discord</span>
            <FontAwesomeIcon className="h-6 w-6" icon="discord" />
          </a>
          <a
            href="https://twitter.com/denosaurs"
            class="ml-6 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Twitter</span>
            <FontAwesomeIcon className="h-6 w-6" icon="twitter" />
          </a>
        </div>
      </div>
    );
  }