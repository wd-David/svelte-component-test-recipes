# Svelte Component Test Recipes (WIP)

Svelte component test recipes using Vitest & Testing Library in TypeScript

---

In this repo, we'll use `vitest`, `@testing-library/svelte`, and `svelte-htm` to test Svelte components that seemed to be hard to test. Such as **two-way bindings**, **name slots**, **Context API**, ...etc.

Feel free to open an issue or send a PR to add more test recipes. 😉

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

`Vitest` can read your configuration in your existing `vite.config.(js|ts)` file, and here is my setup:

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

You may notice that there is a `setupTest.ts` file. We can add `@testing-library/jest-dom` matchers & mocks of SvelteKit there:

```ts
// setupTest.ts
/* eslint-disable @typescript-eslint/no-empty-function */
import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import type { Navigation, Page } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import * as navigation from '$app/navigation';
import * as stores from '$app/stores';

// Add custom jest matchers
expect.extend(matchers);

// Mock SvelteKit runtime module $app/navigation
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

// Mock SvelteKit runtime module $app/stores
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
> The `@testing-library/jest-dom` library provides a set of custom jest matchers that you can use to extend vitest. These will make your tests more declarative and clear to read and maintain. You can also check [Common mistakes with React Testing Library #Using the wrong-assertion](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-the-wrong-assertion).

> SvelteKit runtime modules like `$app/stores` and `$app/navigation` are not set until SvelteKit's start function is called, which means you won't have them in a test environment because tests are isolated. In the context of unit testing, any small gaps in functionality can be resolved by simply mocking that module.


### Caveats ⚠️

This repo use [`patch-package`](https://github.com/ds300/patch-package) to work around the issue when you pass `svelte-htm` inline component in a `render` function: [New component root property may throw errors #6584](https://github.com/sveltejs/svelte/issues/6584)

Here are the steps:

1. Change the source code in the `node_modules`:

```diff
// /node_modules/svelte/internal/index.mjs
- root: options.target || parent_component.$$.root
+ root: options.target || parent_component?.$$.root
```

2. Run `npx patch-package svelte`
3. Add `"postinstall": "patch-package"` script in your `package.json`

It can be fixed by [[fix] check for parent_component before accessing root #6646](https://github.com/sveltejs/svelte/pull/6646).

Also, the latest update of `svelte-htm` was two years ago, so it might not be a good choice in the longer term.

> But a relatively better choice now. It would be great if `@testing-library/svelte` could support it natively.

OK! The setup is ready, let's start with a simple component test.

## Testing component props

Here's our svelte component:
```svelte
// $lib/props/DefaultProps.svelte
<script>
  export let answer = 'a mystery';
</script>

<p>The answer is {answer}</p>
```

It's a simple component that only has one prop `answer` with a default value.

Let's see how to test the default value and pass a new one:

```ts
// $lib/props/DefaultProps.test.ts
import { render, screen } from '@testing-library/svelte';
import DefaultProps from './DefaultProps.svelte';

it("doesn't pass prop", () => {
  render(DefaultProps);
  expect(screen.queryByText('The answer is a mystery')).toBeInTheDocument();
});

it('set and update prop', async () => {
  // Pass your prop to the render function
  const { component } = render(DefaultProps, { answer: 'I dunno' });

  expect(screen.queryByText('The answer is I dunno')).toBeInTheDocument();

  // Update prop using Svelte's Client-side component API
  await component.$set({ answer: 'another mystery' });
  expect(screen.queryByText('The answer is another mystery')).toBeInTheDocument();
});
```

If you're using TypeScript, a recent release of `@testing-library/svelte`
had improved props typing for `render` function:

![demo-props-test](./static/demo-props-test.gif)

Sometimes you may want to predefined your props before passing, we can use Svelte's native utility type `ComponentProps`. `ComponentProps` takes in a Svelte component type and gives you a type corresponding to the component’s props.

```ts
// $lib/props/DefaultProps.test.ts
import type { ComponentProps } from 'svelte';
import { render, screen } from '@testing-library/svelte';
import DefaultProps from './DefaultProps.svelte';

it('Pass predefined prop to the component', () => {
  const prop: ComponentProps<DefaultProps> = { answer: 'TypeScript!' };

  render(DefaultProps, prop);

  expect(screen.getByText('The answer is TypeScript!'));
});
```

> Here is a great post from Andrew Lester: [Typing Components in Svelte](https://www.viget.com/articles/typing-components-in-svelte/). Highly recommended.

## Testing component events

The component that we're going to test has a button, it'll dispatch a custom event `message` when you click on it. It's the same component at [svelte.dev/tutorials](https://svelte.dev/tutorial/component-events).

```svelte
// $lib/events/ComponentEvent.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function sayHello() {
    dispatch('message', {
      text: 'Hello!'
    });
  }
</script>

<button on:click={sayHello}> Click to say hello </button>
```

To test component events, we need to use a combination of vitest utility function `vi.fn` and Svelte client-side component api `component.$on`. We also use `@testing-library/user-event` instead of built-in `fireEvent` to simulate the user interaction.

> `user-event` applies workarounds and mock the UI layer to simulate user interactions like they would happen in the browser. Check [Common mistakes with React Testing Library  #Not using @testing-library/user-event.](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-testing-libraryuser-event)

```ts
// $lib/events/ComponentEvent.test.ts
import { render, screen } from '@testing-library/svelte';
import ComponentEvent from './ComponentEvent.svelte';
import userEvent from '@testing-library/user-event';

it('Test ComponentEvent component', async () => {
  const user = userEvent.setup();

  const { component } = render(ComponentEvent);

  // Mock function
  let text = '';
  const mock = vi.fn((event) => (text = event.detail.text));
  component.$on('message', mock);

  const button = screen.getByRole('button');
  await user.click(button);

  expect(mock).toHaveBeenCalled();
  expect(text).toBe('Hello!');
});
```

We first create a mock function and pass it to the `component.$on`, so we can monitor it whenever the component dispatch an `message` event.

## Testing the `bind:` directive (two-way binding)

## Testing the `use:` directive (svelte action)

## Testing slots

## Testing the Context API

## Testing component with SvelteKit runtime modules (`$app/*`)
