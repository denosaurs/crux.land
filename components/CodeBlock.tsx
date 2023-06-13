import { JSX } from "preact";
import { Highlight, Prism, theme } from "../deps.ts";

type Token = {
  types: string[];
  content: string;
  empty?: boolean;
};

type StyleObj = {
  [key: string]: string | number | null;
};

type RenderProps = {
  tokens: Token[][];
  className: string;
  style: StyleObj;
  getLineProps: (input: {
    key?: unknown;
    style?: StyleObj;
    className?: string;
    line: Token[];
  }) => {
    key?: unknown;
    style?: StyleObj;
    className: string;
  };
  getTokenProps: (input: {
    key?: unknown;
    style?: StyleObj;
    className?: string;
    token: Token;
  }) => {
    key?: unknown;
    style?: StyleObj;
    className: string;
    children: string;
  };
};

export function CodeBlock(
  { code, language }: { code: string; language: string },
): JSX.Element {
  return (
    <div
      class="shadow-sm rounded-lg border border-gray-200 overflow-hidden p-2 sm:px-3 md:px-4"
      style="background-color: rgb(246, 248, 250);"
    >
      <Highlight
        Prism={Prism}
        theme={theme}
        code={code}
        language={language}
      >
        {(
          { className, style, tokens, getLineProps, getTokenProps }:
            RenderProps,
        ) => (
          <pre
            class={`${className} flex overflow-y-auto`}
            style={{ ...style }}
          >
            <code class="pr-2 sm:pr-3">
              {tokens.map((line: Token[], i: number) =>
                line[0]?.empty && i === tokens.length - 1 ? null : (
                  <div
                    key={i + "l"}
                    class="text-gray-300 token-line text-right select-none text-xs"
                  >
                    {i + 1}
                  </div>
                )
              )}
            </code>
            <code>
              {tokens.map((line: Token[], i: number) => {
                const lineProps = getLineProps({ line, key: i });
                lineProps.className += " text-xs";
                return line[0]?.empty && i === tokens.length - 1
                  ? null
                  : (
                    <div key={i} {...lineProps}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
