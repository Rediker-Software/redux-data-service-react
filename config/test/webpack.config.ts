// tslint:disable no-var-requires no-console

import Config from "webpack-config";
import * as glob from "fast-glob";
import * as CleanWebpackPlugin from "clean-webpack-plugin";

import { join } from "path";
import { mapKeys } from "lodash";

const outPath = join(__dirname, "../../test-dist");

const testFilter = process.env.TEST ? process.env.TEST : "*";
const testSourcePath = join(__dirname, `../../src/**/${testFilter}.test.{ts,tsx}`);

if (process.env.TEST) {
  console.log(`TEST=${process.env.TEST}`);
}

const files = glob.sync(testSourcePath, { case: false, cwd: "src" });

const entries = mapKeys(files, (fileName: string) => (
  fileName
    .substring(fileName.indexOf("src") + 4, fileName.lastIndexOf("."))
    .replace(/(\/|\\)/g, "-")
));

export default new Config().extend("config/base/webpack.config.ts").merge({
  mode: "none",
  devtool: "inline-source-map",
  entry: {
    ...entries,
  },
  output: {
    filename: "[name].js",
    path: outPath,
    publicPath: "/",
  },
  plugins: [
    new CleanWebpackPlugin([outPath], { verbose: true, allowExternal: true }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        "test-vendors": {
          test: /[\\/]node_modules[\\/](enzyme|faker|redux-test-utils|sinon|chai)[\\/]/,
          name: "test-vendors",
          chunks: "all",
          enforce: true,
        },
        vendors: {
          name: "vendors",
        },
        common: {
          name: "common",
        }
      }
    }
  },
});
