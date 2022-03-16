export type WalletTransportType = "injected" | "walletConnect";

export type WalletTransport = {
  name: WalletTransportType;
  requestAccounts: () => Promise<string[]>;
  listen: (handler: (accounts: string[]) => void) => void;
};

export type CacheTransport = {
  serialize: (wallet: Wallet) => void;
  deserialize: () => Wallet;
};

export type SsrTransport = {
  setToken: (wallet: string) => void;
  removeToken: () => void;
};

export type Wallet = {
  address: string;
  balance: number;
  connected: boolean;
  connector: WalletTransportType | null;
};
