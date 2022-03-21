export declare type WalletTransportType = "injected";
export declare type SerializableSession = Record<string, any>;
export declare type WenSession = SerializableSession & {
    wallet: Wallet;
};
export declare type CacheTransport = {
    serialize: (wallet: Wallet, session?: SerializableSession) => void;
    deserialize: () => Wallet;
};
export declare type SsrTransport = {
    setToken: (wallet: Wallet, session?: SerializableSession) => Promise<void>;
    removeToken: () => void;
};
/**
 * address: string;
 */
export declare type Wallet = {
    address: string;
    balance: string;
    connected: boolean;
    connector: WalletTransportType | null;
    chainId: string;
};
export declare type WenConfig = {
    ssr: boolean;
    endpoint: string;
};
