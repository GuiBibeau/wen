export declare const decode: (token: string, key: string, noVerify?: boolean | undefined, algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | undefined) => any;
export declare const encode: (payload: Record<string, any>, key: string, algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | undefined, options?: Record<string, any> | undefined) => string;
