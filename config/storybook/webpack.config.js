const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;
const DotenvPlugin = require("dotenv-webpack");
const { join } = require("path");

module.exports = function (config, env, defaultConfig) {
  defaultConfig.module.rules.push(
    // ts & tsx files
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      include: [/src/],
      loader: "awesome-typescript-loader",
    },

    // fonts
    {
      test: /\.(woff(2)?|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts/"
        }
      }]
    }
  );

  defaultConfig.resolve.extensions.push(".tsx", ".ts", ".js");
  // Fix webpack's default behavior to not load packages with jsnext:main module
  // https://github.com/Microsoft/TypeScript/issues/11677
  defaultConfig.resolve.mainFields = ["browser", "main"];
  defaultConfig.resolve.plugins = [
    new TsConfigPathsPlugin({ configFileName: "./tsconfig.json" }),
  ];

  defaultConfig.plugins.push(new DotenvPlugin({ path: join(__dirname, "./.env"), systemvars: true }));
  defaultConfig.watch = true;

  return defaultConfig;
};
