import { encode } from "../core/token/helpers";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { decodeToken } from "core/token/decodeToken";
import { initialWallet } from "core";
import { Wallet } from "core/models";

export const WenConnect = async (req: NextApiRequest, res: NextApiResponse) => {
  const WEN_SECRET = process.env.WEN_SECRET;

  if (!WEN_SECRET) {
    return res.status(500).json({
      error: "WEN_SECRET environment variable is not set",
    });
  }

  switch (req.method) {
    case "POST":
      const { wallet, ...session } = JSON.parse(req.body);

      if (!wallet) {
        res.status(400).json({ error: "Missing wallet" });
        return;
      }

      const token = encode({ wallet, ...session }, WEN_SECRET);

      res.setHeader("Set-Cookie", [
        `wen-wallet=${token}; Path=/ ; Secure ; HttpOnly ; SameSite=Strict ; Max-Age=604800 ;`,
      ]);

      return res.status(200).json({ token, wallet });

    case "DELETE":
      if (!req.cookies["wen-wallet"]) {
        return null;
      }
      res.setHeader("Set-Cookie", [
        `wen-wallet=deleted; Path=/; Secure ; HttpOnly ; SameSite=Strict ; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ]);

      return res.status(200).json({ deleted: true });

    case "GET":
      if (!req.cookies["wen-wallet"]) {
        return res.status(200).json({});
      }

      const wenSession = decodeToken(
        req.cookies["wen-wallet"],
        process.env.WEN_SECRET!
      );

      return res.status(200).json(wenSession);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export const getSession = (context: GetServerSidePropsContext) => {
  const { req } = context;

  if (!req.cookies["wen-wallet"]) {
    return { wallet: initialWallet };
  }

  const WEN_SECRET = process.env.WEN_SECRET;

  if (!WEN_SECRET) {
    return { wallet: initialWallet };
  }

  try {
    return decodeToken(req.cookies["wen-wallet"], WEN_SECRET) as Wallet;
  } catch (e) {
    return { wallet: initialWallet };
  }
};

export * from "../core/token/helpers";
