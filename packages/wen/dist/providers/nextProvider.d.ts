import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { Wallet } from "core/models";
export declare const WenConnect: (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any> | null>;
export declare const getSession: (context: GetServerSidePropsContext) => Wallet | {
    wallet: Wallet;
};
export * from "../core/token/helpers";
