# Wen Connect? Now!

[![Version](https://img.shields.io/npm/v/wen-connect?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/wen-connect)
[![Build Size](https://img.shields.io/bundlephobia/minzip/wen-connect?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=wen-connect)
[![Downloads](https://img.shields.io/npm/dt/wen-connect.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/wen-connect)

Tiny library (5kb zipped) that let's you focus on building Web3 features. Supports connecting to metamask and many other features soon.

## usage

```bash
yarn add wen-connect
# or
npm install wen-connect --save
```

Wen works in all Javascript applications but offers different bindings for different frameworks.

### React

---

Add `WenProvider` to your root component

```tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WenProvider } from "wen-connect";

ReactDOM.render(
  <React.StrictMode>
    <WenProvider>
      <App />
    </WenProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

And start using the hook inside components!

**connect/disconnect:**

```tsx
import { useConnect } from "wen-connect";

const { connect, disconnect } = useConnect();
```

**current address**

```tsx
import { useWen } from "wen-connect";

// empty string if not connected
const { address } = useWen();
```

### Next.js

---

Wen also works in SSR with Next.js to let you connect. Activate the ssr prop in the provider and add your provider to [`_app.tsx`](https://nextjs.org/docs/advanced-features/custom-app):

```tsx
import { WenProvider } from "wen-connect";

function MyApp({ Component, pageProps }) {
  return (
    <WenProvider ssr>
      <Component {...pageProps} />
    </WenProvider>
  );
}
```

Create a `pages/api/wen.tsx` for wen to use JWT sessions:

```tsx
export { WenConnect as default } from "wen-connect";
```

Add a WEN_SECRET environment variable in your `.env` file. It will be used to encrypt the JWT token.

Now you should have access to the address in [getServerSideprops](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props).

```ts
import { useWen } from "wen-connect";

///...
import { getSession } from "wen-connect";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = await getSession(context);

  // fetch some data to display based on user address

  return {
    props: {
      /// your data
    },
  };
};
```

## Roadmap:

- [ ] ethers.js bindings
- [ ] svelte and svelte kit bindings
- [ ] wallet connect
- [ ] coinbase wallet
- [ ] The graph integrations
- [ ] more examples
