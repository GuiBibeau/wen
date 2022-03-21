export type WalletTransportType = "injected";

export type SerializableSession = Record<string, any>;

export type WenSession = SerializableSession & {
  wallet: Wallet;
};

export type CacheTransport = {
  serialize: (wallet: Wallet, session?: SerializableSession) => void;
  deserialize: () => Wallet;
};

export type SsrTransport = {
  setToken: (wallet: Wallet, session?: SerializableSession) => Promise<void>;
  removeToken: () => void;
};

/**
 * address: string;
 */
export type Wallet = {
  address: string;
  balance: string;
  connected: boolean;
  connector: WalletTransportType | null;
  chainId: string;
};

export type WenConfig = {
  ssr: boolean;
  endpoint: string;
};
