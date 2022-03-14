import * as React from "react";
import { useSnapshot } from "valtio";
import { Wen } from "../core";

const WenContext = React.createContext<Wen | undefined>(undefined);

export const WenProvider: React.FC<{ ssr?: boolean }> = ({
  children,
  ssr = false,
}) => {
  const value = new Wen(ssr);

  return <WenContext.Provider value={value}>{children}</WenContext.Provider>;
};

export const useWen = () => {
  const context = React.useContext(WenContext);
  if (context === undefined) {
    throw new Error("useWen must be used within a WenProvider");
  }

  return useSnapshot(context.wallet);
};

export const useConnect = () => {
  const context = React.useContext(WenContext);
  if (context === undefined) {
    throw new Error("useConnect must be used within a WenProvider");
  }

  return {
    connect: context.requestAccount,
    disconnect: context.disconnect,
  };
};
