import { Wallet, WenConfig, WenSession } from "core/models";
import * as React from "react";
import { subscribe, snapshot } from "valtio";
import { Wen, InitialSession } from "../core";

const WenContext = React.createContext<Wen | undefined>(undefined);

export const WenProvider: React.FC<{ config: WenConfig }> = ({
  children,
  config,
}) => {
  const value = new Wen(config);

  return <WenContext.Provider value={value}>{children}</WenContext.Provider>;
};

/**
 * Hook to interface with a session in any react application.
 * @param hydrationData you can pass a session you read from the server.
 *  This will be used in the initial render of the hook. Wen will hydrate the session from local Storage on it's own after.
 * @returns a wallet object and connect/disconnect
 * @example
 * const { wallet, connect, disconnect } = useWen();
 * 
 * wallet 
address: "0xf0259a18c41abfe00329707795b23f0a56bff30b"
balance: "0x0"
chainId: "0xa86a"
connected: true
connector: "injected"

connect({ chainId: "0xa86a" }) // optional, will connect to the wallet with the specified chainId
 * @description

 */
export const useWen = (hydrationData: WenSession = InitialSession) => {
  const context = React.useContext(WenContext);
  if (context === undefined) {
    throw new Error("useWen must be used within a WenProvider");
  }

  const [wallet, setWallet] = React.useState<Wallet>(hydrationData.wallet);

  subscribe(context.wallet, () => {
    setWallet(snapshot(context.wallet));
  });

  React.useEffect(() => {
    setWallet(snapshot(context.wallet));
  }, []);

  return {
    connect: context.connect,
    disconnect: context.disconnect,
    wallet,
  };
};
