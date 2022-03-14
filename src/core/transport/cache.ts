import type { CacheTransport, Wallet } from "../models";

export const cacheTransport: CacheTransport = {
  serialize: (wallet: Wallet) => {
    localStorage.setItem("wen-wallet", JSON.stringify(wallet));
  },
  deserialize: () => {
    const data = localStorage.getItem("wen-wallet");
    if (data) {
      const { address, balance, connected, connector } = JSON.parse(data);
      return {
        address,
        balance,
        connected,
        connector,
      };
    }
    return {
      address: "",
      balance: 0,
      connected: false,
      connector: null,
    };
  },
};
