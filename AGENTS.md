# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm/Turborepo monorepo. Libraries and Vue components live in `packages/`; shared tool presets live in `configs/`. Products are under `apps/`, CLIs and templates under `cli/`, services under `server/`, and VitePress documentation under `docs/project-docs`. Package source normally belongs in `src/`; tests are in `__tests__/` or beside the module.

## Explicitly Ignored Projects

Unless a task names them, do not modify, lint, build, or test these 12 projects:

1. `apps/yapi-to-typescript`
2. `packages/vue3-antd-pc-ui-nuxt`
3. `packages/vue3-antd-pc-ui-nuxt/playground`
4. `packages/vue3-pc-ui-nuxt`
5. `packages/vue3-pc-ui-nuxt/playground`
6. `cli/create-app/template/api`
7. `cli/create-app/template/monorepo`
8. `cli/create-app/template/nuxt3`
9. `cli/create-app/template/vitepress-docs`
10. `cli/create-app/template/vue3-antd-vite`
11. `cli/create-app/template/vue3-component-lib`
12. `cli/create-app/template/vuepress-docs`

## Build, Test, and Development Commands

Use Node 22.19.0 and pnpm 10.15.1, as pinned in `package.json`.

- `pnpm install`: install all workspace dependencies and generate package stubs.
- `pnpm dev`: run workspace development tasks through Turbo.
- `pnpm build`: build all packages in dependency order.
- `pnpm test:unit`: run Vitest projects once with DOM support.
- `pnpm test:coverage`: run package coverage tasks and write `coverage/` output.
- `pnpm lint`: run Oxlint (the only linter; ESLint has been removed).
- `pnpm lint:fix`: run Oxlint with autofix.
- `pnpm format`: format TypeScript, TSX, and Markdown with Prettier.
- `pnpm --filter <package-name> <script>`: target one workspace, for example `pnpm --filter @quantum-design/utils test`.

## Coding Style & Naming Conventions

Prettier is authoritative: use four-space indentation, semicolons, single quotes, trailing commas, and LF-compatible automatic line endings. Oxlint enforces TypeScript, Vue, Node, JSDoc, and test rules via `@quantum-design-configs/oxlint`. Name Vue components and general modules with kebab-case filenames (`use-virtual-scroll.ts`, `q-table.vue`); use camelCase for variables/functions and PascalCase for exported types and components. Keep public exports explicit through each package entry point.

## Testing Guidelines

Vitest uses `happy-dom` for browser-facing packages and Vue Test Utils for components. Most suites use `__tests__/*.test.ts` or `*.test.tsx`; `packages/polyfill` uses `*.spec.ts`. Add regression tests with behavior changes.

## Commit & Pull Request Guidelines

Use Conventional Commits, matching history and commitlint: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `build:`, `ci:`, or `chore:`. Keep headers under 108 characters; `pnpm commit` opens the guided czg prompt. Add a Changeset for publishable package changes. PRs should target `main`, explain intent and verification, link relevant issues, and include screenshots for UI changes. Keep each PR focused and ready for squash merge; non-draft PRs have auto-merge enabled.
