import type { SerializableSession, Wallet, WalletTransportType, WenConfig, WenSession } from "./models";
declare type DesiredState = {
    chainId?: string;
    method?: WalletTransportType;
};
export declare const initialWallet: Wallet;
export declare const InitialSession: WenSession;
export declare const InitialDesiredState: DesiredState;
export declare class Wen {
    private isClient;
    private ssrSession;
    private _session;
    wallet: Wallet;
    constructor({ ssr }: WenConfig);
    private listen;
    private _onAccountChange;
    private _onNetworkChange;
    private _serialize;
    private _destroySession;
    /**
     *
     * @param desiredState optional state to set in the connection flow : chainId, method(only injected supported so far)
     * @returns
     */
    connect: (desiredState?: DesiredState) => Promise<string>;
    disconnect: () => void;
    saveSession: (session: SerializableSession) => Promise<void>;
    get session(): SerializableSession;
}
export {};
