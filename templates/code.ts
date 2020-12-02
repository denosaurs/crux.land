export function renderCode(code: string, id: string, ext = "ts"): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autolinker/prism-autolinker.min.css" integrity="sha512-4ZmAB2UXPu3Rgy5ZClpqnJ/zXXZBdulFXY1eWMLgIjp2HWgkHGIpr1b7kmCK+rdD5NYfivTp47UR+bQ4oTBllQ==" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/line-numbers/prism-line-numbers.min.css" integrity="sha512-cbQXwDFK7lj2Fqfkuxbo5iD1dSbLlJGXGpfTDqbggqjHJeyzx88I3rfwjS38WJag/ihH7lzuGlGHpDBymLirZQ==" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://unpkg.com/prism-themes@1.5.0/themes/prism-darcula.css">
    <style>
      body {
        margin: 0;
      }
      code[class*="language-"], pre[class*="language-"] {
        margin: 0;
      }
      pre[class*="language-"] {
        min-height: 100vh;
        padding: 0;
      }
    </style>
    <title>${id}</title>
  </head>
  <body class="line-numbers">
    <pre class="language-${ext}"><code>${code}</code></pre>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/components/prism-core.min.js" integrity="sha512-hqRrGU7ys5tkcqxx5FIZTBb7PkO2o3mU6U5+qB9b55kgMlBUT4J2wPwQfMCxeJW1fC8pBxuatxoH//z0FInhrA==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autoloader/prism-autoloader.min.js" integrity="sha512-Q3qGP1uJL/B0sEmu57PKXjCirgPKMbg73OLRbTJ6lfHCVU5zkHqmcTI5EV2fSoPV1MHdKsCBE7m/aS6q0pPjRQ==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autolinker/prism-autolinker.min.js" integrity="sha512-/uypNVmpEQdCQLYz3mq7J2HPBpHkkg23FV4i7/WSUyEuTJrWJ2uZ3gXx1IBPUyB3qbIAY+AODbanXLkIar0NBQ==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/line-numbers/prism-line-numbers.min.js" integrity="sha512-1oLZvExT5RaW4q2GgvRPf+XzVVGmsKirfZBRN7aifdOpvZ1L9idEncfMFlfHiQNGBA+Sev+alscSAT/xQ0rwXA==" crossorigin="anonymous"></script>
  </body>
  </html>`
}