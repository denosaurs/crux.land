import { h, Highlight, Prism, theme } from "../deps.ts";

export function CodeBlock(
  { code, language }: { code: string; language: string },
): h.JSX.Element {
  return (
    <div
      className="shadow-sm rounded-lg border border-gray-200 overflow-hidden p-2 sm:px-3 md:px-4"
      style="background-color: rgb(246, 248, 250);"
    >
      <Highlight
        Prism={Prism}
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className + " flex overflow-y-auto"}
            style={{ ...style }}
          >
            <code className="pr-2 sm:pr-3">
              {tokens.map((line, i) =>
                line[0]?.empty && i === tokens.length - 1 ? null : (
                  <div
                    key={i + "l"}
                    className="text-gray-300 token-line text-right select-none text-xs"
                  >
                    {i + 1}
                  </div>
                )
              )}
            </code>
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                lineProps.className += " text-xs";
                return line[0]?.empty && i === tokens.length - 1 ? null : (
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
