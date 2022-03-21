import * as React from "react";
export declare const WenProvider: React.FC<{
    ssr?: boolean;
}>;
export declare const useWen: () => {
    readonly address: string;
    readonly balance: number;
    readonly connected: boolean;
    readonly connector: import("../core/models").WalletTransportType | null;
};
export declare const useConnect: () => {
    connect: (method?: import("../core/models").WalletTransportType) => Promise<string>;
    disconnect: () => void;
};
export declare const useSession: () => {
    saveSession: (session: import("../core/models").SerializableSession) => Promise<void>;
    session: import("../core/models").SerializableSession;
};
