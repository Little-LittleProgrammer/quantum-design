# Turborepo starter with pnpm

This is an official starter turborepo.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following packages/apps:

### Apps and Packages
> pleace be sure to read this section carefully, path `packages/`

- `docs`: a docs app
- `ad.qmniu.com`: another app
- `@wuefront/ui`: a stub component library shared by `apps`
- `@wuefront-configs/`: configurations includes `eslint`、`tsconfig`、`stylelint`)
- `@wuefront/hooks`: a hooks folder be used in apps
- `@wuefront/shared`: don't need packaging utils (includes 'style', 'enums')
- `@wuefront/types`: global ts types
- `@wuefront/utils`: utils folder be used in apps
- `@wuefront/http`: secondary encapsulation's axios utils will be used in apps

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/). 

If you want use `Javascript`, please don't use `@wuefront/hooks` `@wuefront/shared/enums`

All `packages` are treated as dependencies in `apps/<you app name>/node_modules`

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

This repository is used in the `npx create-turbo@latest` command, and selected when choosing which package manager you wish to use with your monorepo (pnpm).

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```
if you want build uni apps

```
pnpm run build --filter <you app name, write in `package.json`>
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm run dev --filter <you app name, write in `package.json`>
```

### Remote Caching

We are already used remote cache, remote cache sever: `http://47.103.85.18:9000`

We set up our own remote cache server. 
Here is the official tutorial: 

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
pnpx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
pnpx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
