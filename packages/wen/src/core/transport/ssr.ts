import type { SsrTransport } from "../models";

export const ssrTransport: SsrTransport = {
  setToken: async (address, session) => {
    await fetch("/api/wen", {
      method: "POST",
      body: JSON.stringify({
        wallet: address,
        ...(typeof session !== "undefined" && session),
      }),
    });
  },
  removeToken: () => {
    fetch("/api/wen", {
      method: "DELETE",
    });
  },
};
