import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import type { WalletTransport } from "../models";

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

export const walletConnect: WalletTransport = {
  name: "walletConnect",
  requestAccounts: async () => {
    if (!connector.connected) {
      connector.createSession();
      return Promise.resolve([]);
    }

    return Promise.resolve(connector.session.accounts);
  },
  listen: (handler) => {
    connector.on("connect", (_error, payload) => {
      handler(payload.params[0].accounts);
    });
    connector.on("session_update", (_error, payload) => {
      handler(payload.params[0].accounts);
    });
    connector.on("disconnect", () => handler([]));
  },
};
