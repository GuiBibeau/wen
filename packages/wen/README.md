## Wen Connect? Now!

I am currently rewritting all of this to work better in React 18 and come with a optional UI kit

[![Version](https://img.shields.io/npm/v/wen-connect?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/wen-connect)
[![Build Size](https://img.shields.io/bundlephobia/minzip/wen-connect?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=wen-connect)
[![Downloads](https://img.shields.io/npm/dt/wen-connect.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/wen-connect)

Minimalistic library for Web3 user interfaces.

- Seamless connection flows to Metamask.
- Stateless sessions that work anywhere (client, serverless, Edge Functions).
- Respectful of user privacy. Take only the needed information, nothing more. Never saved to a DB.

Wen is about getting you to build Web3 instead of figuring out the patch work of software needed.

## Usage

<br />

```bash
yarn add wen-connect
# or
npm install wen-connect --save
```

Wen works in all JavaScript applications, but offers different bindings for different frameworks.

### React

---

One single context: `WenProvider`, and one hook: `useWen` for everything.

Add `WenProvider` to your root component:

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

Use the hook to engage with your user:

```tsx
import { useWen } from "wen-connect";

const MyComponent = () => {
  const { connect, disconnect, wallet } = useWen();

  const handleConnect = () => {
    // Optional argument to specify which chain to get the user connected on.
    connect({ chainId: "0xa86a" });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return <span>{wallet.address}</span>;
};
```

`wallet` contains the following info:

```yml
address: string
balance: Hex string
chainId: Hex string
connected: boolean
connector: "injected"
```

### Next.js

---

Wen also works server-side with Next.js to let you connect. Activate the ssr prop in the provider and add your provider to [`_app.tsx`](https://nextjs.org/docs/advanced-features/custom-app):

```tsx
import { WenProvider } from "wen-connect";

function MyApp({ Component, pageProps }) {
  const config = { ssr: true };
  return (
    <WenProvider config={config}>
      <Component {...pageProps} />
    </WenProvider>
  );
}
```

Create a `pages/api/wen.tsx` for Wen to use JWT sessions:

```tsx
export { WenConnect as default } from "wen-connect";
```

Add a WEN_SECRET environment variable in your `.env` file. It will be used to encrypt the JWT token.

Now, you can get the session in `getServerSideprops` and use it to hydrate Wen on the client-side first render.

```tsx
import { getSession, useWen } from "wen-connect";

function Index(props) {
  // Passing the session will avoid empty initial renders, saving your users loading time.
  const { wallet } = useWen(props.session);

  return <div>{wallet.address}</div>;
}

export default Index;

export const getServerSideProps = async (context) => {
  return {
    props: {
      // session.wallet is the same info as const { wallet } = useWen(props session);
      session: getSession(context),
    },
  };
};
```

## Roadmap:

- Signing in desired user state.
- Svelte and SvelteKit bindings.
- Wallet connect.
- Coinbase wallet.
- The graph integrations.
- More examples.
