export function renderCode(code: string, id: string, ext = "ts"): string {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autolinker/prism-autolinker.min.css" integrity="sha512-4ZmAB2UXPu3Rgy5ZClpqnJ/zXXZBdulFXY1eWMLgIjp2HWgkHGIpr1b7kmCK+rdD5NYfivTp47UR+bQ4oTBllQ==" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/line-numbers/prism-line-numbers.min.css" integrity="sha512-cbQXwDFK7lj2Fqfkuxbo5iD1dSbLlJGXGpfTDqbggqjHJeyzx88I3rfwjS38WJag/ihH7lzuGlGHpDBymLirZQ==" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
      <link rel="stylesheet" href="../theme.css">
      <link rel="stylesheet" href="../index.css">
      <style>
        .grid {
          padding: 50px 0;
          height: calc(100vh - var(--footer-height) - 100px);
        }
      
        code[class*="language-"], pre[class*="language-"] {
          margin: 0;
        }
        
        pre[class*="language-"] {
          border-left: var(--border);
          border-right: var(--border);
          font-size: 12px;
          padding: 0;
        }
      </style>
      <title>${id}</title>
    </head>
    <body style="display: initial;">
      <div class="grid">
        <div class="item button" style="grid-column: 2;">Report</div>
        
        <div class="line-numbers" style="grid-column: span 2;">
          <pre class="item language-${ext}"><code>${code}</code></pre>
        </div>
      </div>
      <footer>
        <p>© 2020 Denosaurs team</p>
        <a href="https://github.com/denosaurs/crux.land" class="github">
          <svg class="logoFill" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
        <a
          href="https://vercel.com?utm_source=denosaurs&utm_campaign=oss"
          class="vercel"
        >
          <p>Powered by</p>
          <svg
            viewBox="0 0 283 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="logoFill"
              d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
            />
          </svg>
        </a>
      </footer>
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/components/prism-core.min.js" integrity="sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha512-Q3qGP1uJL/B0sEmu57PKXjCirgPKMbg73OLRbTJ6lfHCVU5zkHqmcTI5EV2fSoPV1MHdKsCBE7m/aS6q0pPjRQ==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autolinker/prism-autolinker.min.js" integrity="sha512-/uypNVmpEQdCQLYz3mq7J2HPBpHkkg23FV4i7/WSUyEuTJrWJ2uZ3gXx1IBPUyB3qbIAY+AODbanXLkIar0NBQ==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/line-numbers/prism-line-numbers.min.js" integrity="sha512-1oLZvExT5RaW4q2GgvRPf+XzVVGmsKirfZBRN7aifdOpvZ1L9idEncfMFlfHiQNGBA+Sev+alscSAT/xQ0rwXA==" crossorigin="anonymous"></script>
  </html>`
}
