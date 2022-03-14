import { proxy } from "valtio";
import {
  cacheTransport,
  ssrTransport,
  injected,
  // walletConnect,
} from "./transport";
import type { Wallet, WalletTransportType } from "./models";

export class Wen {
  isClient = typeof window !== "undefined";
  ssrSession: boolean;
  wallet: Wallet = proxy({
    address: "",
    balance: 0,
    connected: false,
    connector: null,
  });

  constructor(ssr: boolean) {
    this.ssrSession = ssr;
    if (this.isClient) {
      this.wallet = proxy(cacheTransport.deserialize());
      this.listen();
    }
  }

  private listen() {
    injected.listen(this.onAccountChange);
  }

  disconnect = () => {
    this.wallet.address = "";
    this.wallet.balance = 0;
    this.wallet.connected = false;
    this.wallet.connector = null;
    cacheTransport.serialize(this.wallet);
    if (this.ssrSession) {
      ssrTransport.removeToken();
    }
  };

  onAccountChange = (address: string[]) => {
    if (!address.length) {
      this.disconnect();
      return;
    }

    this.wallet.address = address[0];
    this.wallet.connected = true;
    cacheTransport.serialize(this.wallet);
    if (this.ssrSession) {
      ssrTransport.setToken(address[0]);
    }
  };

  requestAccount = async (method: WalletTransportType = "injected") => {
    switch (method) {
      // case "walletConnect":
      //   this.wallet.connector = "walletConnect";
      //   const walletConnectAccounts = await walletConnect.requestAccounts();
      //   if (walletConnectAccounts) {
      //     this.wallet.address = walletConnectAccounts[0];
      //     this.wallet.connected = true;
      //     cacheTransport.serialize(this.wallet);
      //     if (this.ssrSession) {
      //       ssrTransport.setToken(walletConnectAccounts[0]);
      //     }
      //   }
      //   walletConnect.listen(this.onAccountChange);
      //   break;

      default:
        const accounts = await injected.requestAccounts();

        if (accounts.length) {
          this.wallet.address = accounts[0];
          this.wallet.connected = true;
          this.wallet.connector = "injected";

          cacheTransport.serialize(this.wallet);
          ssrTransport.setToken(accounts[0]);
        }
        break;
    }
  };

  get address() {
    return this.wallet.address;
  }
}
