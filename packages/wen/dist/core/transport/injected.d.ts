export declare const injected: {
    name: string;
    requestAccounts: () => Promise<any>;
    requestBalance: (address: string) => Promise<any>;
    requestChainId: () => Promise<any>;
    switchChain: (chainId: string) => Promise<any>;
    listen: (handler: (address: string[]) => Promise<void>, networkHandler: (chainId: string) => void) => void;
};
