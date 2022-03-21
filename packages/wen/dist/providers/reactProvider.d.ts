import { Wallet, WenConfig, WenSession } from "core/models";
import * as React from "react";
export declare const WenProvider: React.FC<{
    config: WenConfig;
}>;
/**
 * Hook to interface with a session in any react application.
 * @param hydrationData you can pass a session you read from the server.
 *  This will be used in the initial render of the hook. Wen will hydrate the session from local Storage on it's own after.
 * @returns a wallet object and connect/disconnect
 * @example
 * const { wallet, connect, disconnect } = useWenSession();
 * wallet contains { address, balance, chainId, connected, connector }
 */
export declare const useWen: (hydrationData?: WenSession) => {
    connect: (desiredState?: {
        chainId?: string | undefined;
        method?: "injected" | undefined;
    }) => Promise<string>;
    disconnect: () => void;
    wallet: Wallet;
};
