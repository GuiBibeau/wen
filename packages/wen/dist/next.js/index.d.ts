import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
export declare const WenConnect: (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any> | null>;
export declare const getSession: (context: GetServerSidePropsContext) => any;
export * from "./helpers";
