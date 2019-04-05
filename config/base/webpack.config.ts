import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

import { join } from "path";
import Config from "webpack-config";

const sourcePath = join(__dirname, "../../src");

const tslint = join(__dirname, "../../tslint.json");
const tsconfig = join(__dirname, "../../tsconfig.json");

export default new Config().merge({
  context: sourcePath,
  entry: {
    main: "./index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "thread-loader",
          "cache-loader",
          {
            loader: "ts-loader",
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              happyPackMode: true,
              experimentalFileCaching: true,
            }
          }
        ]
      },
    ]
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: "empty",
    net: "empty",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tslint,
      tsconfig,
      compilerOptions: {
        skipLibCheck: true,
      }
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "-",
      cacheGroups: {
        vendors: {
          name: false,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true,
        },
        common: {
          name: false,
          minChunks: 2,
          priority: -20,
        }
      }
    }
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ["browser", "main"],
    plugins: [
      new TsConfigPathsPlugin({ configFile: tsconfig }),
    ],
  },
  target: "web",
});
