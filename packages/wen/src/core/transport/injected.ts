export const injected = {
  name: "injected",
  requestAccounts: async () => {
    const { ethereum } = window;
    if (!ethereum) return [];

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || !accounts.length) return [];

      return accounts;
    } catch (e) {
      return [];
    }
  },
  requestBalance: async (address: string) => {
    const { ethereum } = window;
    if (!ethereum) return [];

    try {
      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      if (!balance || !balance.length) return [];

      return balance;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  requestChainId: async () => {
    const { ethereum } = window;
    if (!ethereum) return [];

    try {
      const networkId = await ethereum.request({ method: "eth_chainId" });

      if (!networkId || !networkId.length) return [];

      return networkId;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  switchChain: async (chainId: string) => {
    const { ethereum } = window;
    if (!ethereum) return [];

    try {
      const networkId = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      if (!networkId || !networkId.length) return [];

      return networkId;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  listen: (
    handler: (address: string[]) => Promise<void>,
    networkHandler: (chainId: string) => void
  ) => {
    const { ethereum } = window;
    if (!ethereum?.on) return;

    ethereum.on("accountsChanged", handler);
    ethereum.on("chainChanged", networkHandler);
  },
};
