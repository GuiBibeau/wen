import type { SsrTransport } from "../models";

export const ssrTransport: SsrTransport = {
  setToken: (address: string) => {
    fetch("/api/wen", {
      method: "POST",
      body: JSON.stringify({ wallet: address }),
    });
  },
  removeToken: () => {
    fetch("/api/wen", {
      method: "DELETE",
    });
  },
};
