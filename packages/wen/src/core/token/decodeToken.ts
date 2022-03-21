import { decode } from "./helpers";

export const decodeToken = (
  cookie: string,
  secret: string
): Record<string, any> => {
  if (cookie.length === 0) {
    return {};
  }

  try {
    const token = decode(cookie, secret);

    return token;
  } catch (e) {
    return {};
  }
};
