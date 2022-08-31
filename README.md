# Svelte Component Test Recipes (WIP)

Svelte component test recipes using Vitest & Testing Library in TypeScript

## Caveats ⚠️

This repo use [`patch-package`](https://github.com/ds300/patch-package) to work around this issue: [New component root property may throw errors #6584](https://github.com/sveltejs/svelte/issues/6584)

```diff
// /node_modules/svelte/internal/index.mjs
- root: options.target || parent_component.$$.root
+ root: options.target || parent_component?.$$.root
```

It can be fixed by [[fix] check for parent_component before accessing root #6646](https://github.com/sveltejs/svelte/pull/6646).

## Testing a general component with props

## Testing component events

## Testing the `bind:` directive (two-way binding)

## Testing the `use:` directive (svelte action)

## Testing slots

## Testing the Context API

## Testing component with SvelteKit runtime modules (`$app/*`)
