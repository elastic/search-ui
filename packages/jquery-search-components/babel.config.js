const presets = [["@babel/env"]];

module.exports = {
  sourceMaps: "inline",
  presets,
  plugins: ["@babel/plugin-proposal-class-properties"]
};
