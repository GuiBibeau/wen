import { proxy } from "valtio";
import {
  cacheTransport,
  ssrTransport,
  injected,
  // walletConnect,
} from "./transport";

import type {
  SerializableSession,
  Wallet,
  WalletTransportType,
  WenConfig,
  WenSession,
} from "./models";

type DesiredState = {
  chainId?: string;
  method?: WalletTransportType;
};

export const initialWallet: Wallet = {
  address: "",
  balance: "",
  connected: false,
  connector: null,
  chainId: "",
};

export const InitialSession: WenSession = {
  wallet: initialWallet,
};

export const InitialDesiredState: DesiredState = {
  method: "injected",
};

export class Wen {
  private isClient = typeof window !== "undefined";
  private ssrSession: boolean;
  private _session: SerializableSession = proxy({});
  wallet: Wallet = proxy(initialWallet);

  constructor({ ssr = false }: WenConfig) {
    this.ssrSession = ssr;

    if (this.isClient) {
      const { address, balance, connected, connector, chainId, ...session } =
        cacheTransport.deserialize();
      this.wallet = proxy({ address, balance, connected, connector, chainId });
      this._session = proxy(session);
      this.listen();
    }
  }

  private listen() {
    injected.listen(this._onAccountChange, this._onNetworkChange);
  }

  private _onAccountChange = async (address: string[]) => {
    if (!address.length) {
      this.disconnect();
      return;
    }

    const balance = await injected.requestBalance(address[0]);
    const chainId = await injected.requestChainId();

    this.wallet.address = address[0];
    this.wallet.balance = balance;
    this.wallet.connected = true;
    this.wallet.chainId = chainId;
    this._serialize();
  };

  private _onNetworkChange = (chainId: string) => {
    console.log(this.wallet);
    this.wallet.chainId = chainId;
    this._serialize();
  };

  private _serialize() {
    cacheTransport.serialize(this.wallet);
    if (this.ssrSession) {
      ssrTransport.setToken(this.wallet);
    }
  }

  private _destroySession = () => {
    this._session = proxy({});
    this._serialize();
  };

  /**
   *
   * @param desiredState optional state to set in the connection flow : chainId, method(only injected supported so far)
   * @returns
   */
  connect = async (desiredState: DesiredState = InitialDesiredState) => {
    switch (desiredState.method) {
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
        const balance = await injected.requestBalance(accounts[0]);
        const chainId = await injected.requestChainId();
        if (desiredState.chainId && desiredState.chainId !== chainId) {
          injected.switchChain(desiredState.chainId);
        }
        if (accounts.length) {
          this.wallet.address = accounts[0];
          this.wallet.connected = true;
          this.wallet.balance = balance;
          this.wallet.chainId = chainId;
          this.wallet.connector = "injected";

          cacheTransport.serialize(this.wallet);
          if (this.ssrSession) {
            ssrTransport.setToken(this.wallet);
          }
          return this.wallet.address;
        }
        return "";
    }
  };

  disconnect = () => {
    this.wallet.address = "";
    this.wallet.balance = "";
    this.wallet.connected = false;
    this.wallet.connector = null;
    this.wallet.chainId = "";
    cacheTransport.serialize(this.wallet, {});
    if (this.ssrSession) {
      ssrTransport.removeToken();
    }
    this._destroySession();
  };

  saveSession = async (session: SerializableSession) => {
    this._session = proxy(session);
    cacheTransport.serialize(this.wallet, session);
    Promise.resolve();
    if (this.ssrSession) {
      ssrTransport.setToken(this.wallet, session);
    }
  };

  get session() {
    return this._session;
  }
}
