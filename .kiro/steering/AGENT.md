---
inclusion: always
---
# Architecture

- Projects will be use vertical slice architecture.

# General rules

- Use `ai-elements` components for easily integrate ai feature.
- Keep methods short and focused on single responsibility.
- Name async methods with `Async` suffix.
- Use the `deepcon` MCP to fetch relevant technological information from the previous question before answering.
- Run `typecheck` and `biome:fix` commands to make sure the code is type-safe and formatted correctly.
- Don't comment code, use meaningful variable and function names, except for complex logic or important notes.
- Always use `bun` as package manager, if can't use bun, use `npm` for typecheck and linting.
- Follow `Single Responsibility Principle` for both frontend and backend code.

# Code styles

- Focus on readability and maintainability, also make the code short as possible.
- Use early returns when possible.

## Typescript

- Avoid unnecessary `useState` and `useEffect` when possible.
- Keep a clear boundary between UI (React) and business logic (services, hooks, utils).
- Use `type` for composition (`&`, `|`) and `interface` for structural extension.
- Prefer `readonly` and `as const` when data should be immutable.
- Avoid `any` - prefer `unknown`, `generic` or `type assertion` when necessary.
- Use utility types (`Pick`, `Omit`, `Partial`, `Required`, `Record`) to reduce redundacy.
- Prefer `Enums` or `Literal Types` for type-safe string values.
- For function signatures, always type inputs and outputs explicitly.
- Use `Generics` for reusable hooks/components.
- Never use `useMemo` or `useCallback` because we are on React 19 and its already has the compiler optimizations.
- Use `shadcn/ui` for pre-built components.
- Use `<Context>` directly as a provider instead of `<Context.Provider>` because im on react 19.
- Use `Field` from `Shadcn` to handle form related, [docs](https://ui.shadcn.com/docs/components/field).
- When using the `Dialog` component from `shadcn/ui`, use `sm:max-w-[x]xl` for change max width.
