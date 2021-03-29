# crux.land

[![License](https://img.shields.io/github/license/denosaurs/crux.land)](https://github.com/denosaurs/crux.land/blob/master/LICENSE)

`crux.land` is a free registry service meant for hosting small (`< 10kB`) single
deno scripts. All uploaded scripts are immutable and will not be changed nor
deleted unless there is a legal reason or if it is found malicious.

## Development

`crux.land` runs on [deno deploy](https://deno.com/deploy) and requires the
[`deployctl`](https://deno.com/deploy/docs/deployctl) cli for local development.

For `crux.land` to work there are a few enviornment variables that need to be
set either in the local development enviornment or in the deploy settings. These
enviornment variables are:

| name                     |
| ------------------------ |
| S3_REGION                |
| S3_ACCESS_KEY_ID         |
| S3_SECRET_ACCESS_KEY     |
| S3_BUCKET                |
| DYNAMO_REGION            |
| DYNAMO_ACCESS_KEY_ID     |
| DYNAMO_SECRET_ACCESS_KEY |
| DYNAMO_TABLE             |

Once the enviornment variables are set you can start it locally using:

```bash
> deployctl run --libs ns,fetchevent --config ./tsconfig.json ./main.ts
Listening on http://0.0.0.0:8080
```

## Maintainers

- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))
- crowlKats [@crowlKats](https://github.com/crowlKats)
- Filippo Rossi [@qu4k](https://github.com/qu4k)

## Other

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt` and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2020-2021, the denosaurs team. All rights reserved. MIT license.
