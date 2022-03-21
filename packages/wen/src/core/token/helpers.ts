//@ts-nocheck
import { createVerify, createHmac, createSign } from "crypto";

const algorithmMap = {
  HS256: "sha256",
  HS384: "sha384",
  HS512: "sha512",
  RS256: "RSA-SHA256",
};

const typeMap = {
  HS256: "hmac",
  HS384: "hmac",
  HS512: "hmac",
  RS256: "sign",
};

export const decode = function jwt_decode(
  token: string,
  key: string,
  noVerify?: boolean,
  algorithm?: keyof typeof algorithmMap
) {
  // check token
  if (!token) {
    throw Error("No token supplied");
  }
  // check segments
  let segments = token.split(".");
  if (segments.length !== 3) {
    throw Error("Not enough or too many segments");
  }

  // All segment should be base64
  let headerSeg = segments[0];
  let payloadSeg = segments[1];
  let signatureSeg = segments[2];

  // base64 decode and parse JSON
  let header = JSON.parse(base64urlDecode(headerSeg));
  let payload = JSON.parse(base64urlDecode(payloadSeg));

  if (!noVerify) {
    if (!algorithm && /BEGIN( RSA)? PUBLIC KEY/.test(key.toString())) {
      algorithm = "RS256";
    }

    let signingMethod = algorithmMap[algorithm || header.alg];
    let signingType = typeMap[algorithm || header.alg];
    if (!signingMethod || !signingType) {
      throw Error("Algorithm not supported");
    }

    // verify signature. `sign` will return base64 string.
    let signingInput = [headerSeg, payloadSeg].join(".");
    if (!verify(signingInput, key, signingMethod, signingType, signatureSeg)) {
      throw Error("Signature verification failed");
    }

    // Support for nbf and exp claims.
    // According to the RFC, they should be in seconds.
    if (payload.nbf && Date.now() < payload.nbf * 1000) {
      throw Error("Token not yet active");
    }

    if (payload.exp && Date.now() > payload.exp * 1000) {
      throw Error("Token expired");
    }
  }

  return payload;
};

export const encode = function jwt_encode(
  payload: Record<string, any>,
  key: string,
  algorithm?: keyof typeof algorithmMap,
  options?: Record<string, any>
) {
  // Check key
  if (!key) {
    throw Error("Require key");
  }

  // Check algorithm, default is HS256
  if (!algorithm) {
    algorithm = "HS256";
  }

  let signingMethod = algorithmMap[algorithm];
  let signingType = typeMap[algorithm];
  if (!signingMethod || !signingType) {
    throw Error("Algorithm not supported");
  }

  // header, typ is fixed value.
  let header = { typ: "JWT", alg: algorithm };
  if (options && options.header) {
    assignProperties(header, options.header);
  }

  // create segments, all segments should be base64 string
  let segments = [];
  segments.push(base64urlEncode(JSON.stringify(header)));
  segments.push(base64urlEncode(JSON.stringify(payload)));
  segments.push(sign(segments.join("."), key, signingMethod, signingType));

  return segments.join(".");
};

/**
 * private util functions
 */

function assignProperties(dest: string, source: Record<string, any>) {
  for (let attr in source) {
    if (source.hasOwnProperty(attr)) {
      dest[attr] = source[attr];
    }
  }
}

function verify(input, key, method, type, signature) {
  if (type === "hmac") {
    return signature === sign(input, key, method, type);
  } else if (type == "sign") {
    return createVerify(method)
      .update(input)
      .verify(key, base64urlUnescape(signature), "base64");
  } else {
    throw Error("Algorithm type not recognized");
  }
}

function sign(input, key, method, type) {
  let base64str;
  if (type === "hmac") {
    base64str = createHmac(method, key).update(input).digest("base64");
  } else if (type == "sign") {
    base64str = createSign(method).update(input).sign(key, "base64");
  } else {
    throw Error("Algorithm type not recognized");
  }

  return base64urlEscape(base64str);
}

function base64urlDecode(str) {
  return Buffer.from(base64urlUnescape(str), "base64").toString();
}

function base64urlUnescape(str) {
  str += Array.from({ length: 5 - (str.length % 4) }).join("=");
  return str.replace(/\-/g, "+").replace(/_/g, "/");
}

function base64urlEncode(str) {
  return base64urlEscape(Buffer.from(str).toString("base64"));
}

function base64urlEscape(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
