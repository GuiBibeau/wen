import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "cjs",
      //   sourceMap: true,
    },
  ],
  plugins: [typescript(), uglify()],
  external: [
    "react",
    "react-dom",
    "@walletconnect/client",
    "@walletconnect/qrcode-modal",
  ],
};
