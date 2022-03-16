import { encode, decode } from "jwt-simple";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export const WenConnect = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const { wallet } = JSON.parse(req.body);

      if (!wallet) {
        res.status(400).json({ error: "Missing wallet" });
        return;
      }

      const WEN_SECRET = process.env.WEN_SECRET;

      if (!WEN_SECRET) {
        return res.status(500).json({
          error: "WEN_SECRET environment variable is not set",
        });
      }

      const token = encode({ wallet }, WEN_SECRET);

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

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export const getSession = (context: GetServerSidePropsContext) => {
  const { req } = context;

  if (!req.cookies["wen-wallet"]) {
    return "";
  }

  const WEN_SECRET = process.env.WEN_SECRET;

  if (!WEN_SECRET) {
    return "";
  }

  try {
    const token = decode(
      req.cookies["wen-wallet"],
      process.env.WEN_SECRET!
    ) as { wallet: string };

    return token.wallet;
  } catch (e) {
    return;
  }
};
