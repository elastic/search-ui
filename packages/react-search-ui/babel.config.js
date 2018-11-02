const presets = ["@babel/env", "@babel/preset-react"];

module.exports = {
  sourceMaps: "inline",
  presets,
  plugins: ["@babel/plugin-proposal-class-properties"]
};
