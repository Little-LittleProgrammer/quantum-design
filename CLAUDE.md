# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Build: `pnpm build`
- Build libraries: `pnpm build:lib`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Test with coverage: `pnpm test:coverage`
- Format: `pnpm format`
- Commit: `pnpm commit`

## Architecture

Monorepo structure with multiple apps, CLI tools, config packages, and libraries. Main packages include:

- **Apps**: Playground (Vite)
- **CLIs**: Create app, Product analysis, Workflow cloud
- **Configs**: ESLint, Prettier, TSConfig, Vite, Rollup, Sentry, Tailwind
- **Libraries**: Utils, Shared, Types, HTTP, Hooks, Styles, Polyfill, AI Hub, Vue3 UI components, Vue3 Ant Design UI components

## Development

- Uses Turbo for monorepo management
- TypeScript with strict configs
- Vite as main build tool
- Vitest for testing
- Husky for Git hooks
- Conventional Commits

## Workspaces

- **apps/**: Applications
- **cli/**: CLI tools
- **configs/**: Shared configurations
- **packages/**: Shared libraries
- **docs/**: Documentation
