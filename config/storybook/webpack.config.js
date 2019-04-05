const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { join } = require("path");

const tslint = join(__dirname, "../../tslint.json");
const tsconfig = join(__dirname, "../../tsconfig.json");

module.exports = function (config, env, defaultConfig) {
  defaultConfig.mode = "development";

  defaultConfig.module.rules.push(
    // ts & tsx files
    {
      test: /\.tsx?$/,
      use: [
        "thread-loader",
        "cache-loader",
        {
          loader : "ts-loader",
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
            happyPackMode: true,
            experimentalFileCaching: true,
          }
        }
      ]
    },
  );

  defaultConfig.resolve.extensions.push(".tsx", ".ts", ".js");
  // Fix webpack's default behavior to not load packages with jsnext:main module
  // https://github.com/Microsoft/TypeScript/issues/11677
  defaultConfig.resolve.mainFields = ["browser", "main"];
  defaultConfig.resolve.plugins = [
    new TsConfigPathsPlugin({ configFile: tsconfig }),
  ];

  defaultConfig.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      tslint,
      tsconfig,
      compilerOptions: {
        skipLibCheck: true,
      }
    })
  );

  return defaultConfig;
};
