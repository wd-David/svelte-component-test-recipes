# Svelte Component Test Recipes (WIP)

Svelte component test recipes using Vitest & Testing Library in TypeScript

---

In this repo, we'll use `vitest`, `@testing-library/svelte`, and `svelte-htm` to test Svelte components that were seemed to be hard to test. Such as two-way bindings, name slots, Context API, ...etc. Feel free to open an issue or send a PR to add more test recipes.

## Setup

Let's install libraries in your SvelteKit project.

```bash
# Minimal setup
npm install -D vitest c8 @testing-library/svelte jsdom
# Companion libraries for Testing Library
npm install -D @testing-library/jest-dom  @testing-library/dom @testing-library/user-event @types/testing-library__jest-dom
# Test harness libraries
npm install -D svelte-htm svelte-fragment-component patch-package

```

Since `vitest` can read your configuration in your existing `vite.config.(js|ts)`, you can configure `vitest` like this:

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { configDefaults, type UserConfig as VitestConfig } from 'vitest/config';

const config: UserConfig & { test: VitestConfig['test'] } = {
  plugins: [sveltekit()],
  define: {
    // Eliminate in-source test code
    'import.meta.vitest': 'undefined'
  },
  test: {
    // jest like globals
    globals: true,
    environment: 'jsdom',
    // in-source testing
    includeSource: ['src/**/*.{js,ts,svelte}'],
    // Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
    setupFiles: ['./setupTest.ts'],
    // Exclude files in c8
    coverage: {
      exclude: ['setupTest.ts']
    },
    deps: {
      // Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
      inline: []
    },
    // Exclude playwright tests folder
    exclude: [...configDefaults.exclude, 'tests']
  }
};

export default config;
```

You may notice there is a `setupTest.ts` file, we can add `@testing-library/jest-dom` matchers & mocks of SvelteKit there:

```ts
/* eslint-disable @typescript-eslint/no-empty-function */
import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import type { Navigation, Page } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import * as navigation from '$app/navigation';
import * as stores from '$app/stores';

expect.extend(matchers);

vi.mock('$app/navigation', (): typeof navigation => ({
  afterNavigate: () => {},
  beforeNavigate: () => {},
  disableScrollHandling: () => {},
  goto: () => Promise.resolve(),
  invalidate: () => Promise.resolve(),
  invalidateAll: () => Promise.resolve(),
  prefetch: () => Promise.resolve(),
  prefetchRoutes: () => Promise.resolve()
}));

vi.mock('$app/stores', (): typeof stores => {
  const getStores: typeof stores.getStores = () => {
    const navigating = readable<Navigation | null>(null);
    const page = readable<Page>({
      url: new URL('http://localhost'),
      params: {},
      routeId: null,
      status: 200,
      error: null,
      data: {}
    });
    const updated = { subscribe: readable(false).subscribe, check: () => false };

    return { navigating, page, updated };
  };

  const page: typeof stores.page = {
    subscribe(fn) {
      return getStores().page.subscribe(fn);
    }
  };
  const navigating: typeof stores.navigating = {
    subscribe(fn) {
      return getStores().navigating.subscribe(fn);
    }
  };
  const updated: typeof stores.updated = {
    subscribe(fn) {
      return getStores().updated.subscribe(fn);
    },
    check: () => false
  };

  return {
    getStores,
    navigating,
    page,
    updated
  };
});

```
> The `@testing-library/jest-dom` library provides a set of custom jest matchers that you can use to extend jest. These will make your tests more declarative, clear to read and to maintain. You can also check [Common mistakes with React Testing Library #Using the wrong-assertion](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-the-wrong-assertion).


### Caveats ⚠️

This repo use [`patch-package`](https://github.com/ds300/patch-package) to work around this issue when you pass `svelte-htm` inline component in a `render` function: [New component root property may throw errors #6584](https://github.com/sveltejs/svelte/issues/6584)

```diff
// /node_modules/svelte/internal/index.mjs
- root: options.target || parent_component.$$.root
+ root: options.target || parent_component?.$$.root
```

It can be fixed by [[fix] check for parent_component before accessing root #6646](https://github.com/sveltejs/svelte/pull/6646).

Also, the lastest update of `svelte-htm` was two years ago, it might not be a good choice in a longer-term.

> But a relatively better choice at this moment, it'd be great if `@testing-library/svelte` can support it natively.

## Testing a general component with props

## Testing component events

## Testing the `bind:` directive (two-way binding)

## Testing the `use:` directive (svelte action)

## Testing slots

## Testing the Context API

## Testing component with SvelteKit runtime modules (`$app/*`)
