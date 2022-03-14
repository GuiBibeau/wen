import type { WalletTransport } from "../models";

export const injected: WalletTransport = {
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
  listen: (handler) => {
    const { ethereum } = window;
    if (!ethereum?.on) return;

    ethereum.on("accountsChanged", handler);
  },
};
