import type { CacheTransport } from "../models";

export const cacheTransport: CacheTransport = {
  serialize: (wallet, session) => {
    if (typeof session !== "undefined") {
      localStorage.setItem("wen-session", JSON.stringify(session));
    }
    localStorage.setItem("wen-wallet", JSON.stringify(wallet));
  },
  deserialize: () => {
    const data = localStorage.getItem("wen-wallet");
    const sessionData = localStorage.getItem("wen-session");
    if (data) {
      const { address, balance, connected, connector } = JSON.parse(data);
      const parsedSession = sessionData ? JSON.parse(sessionData) : {};
      return {
        address,
        balance,
        connected,
        connector,
        ...parsedSession,
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
