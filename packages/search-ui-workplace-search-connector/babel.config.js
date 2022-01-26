function parseModulesValue(value) {
  if (value === "false") return false;
  if (value) return value;
  return "commonjs"; // babel's default is commonjs
}

const presets = [
  [
    "@babel/env",
    {
      targets: {
        browsers: ["last 2 versions", "> 5%"]
      },
      modules: parseModulesValue(process.env.BABEL_MODULES)
    }
  ]
];

module.exports = {
  sourceMaps: "inline",
  presets,
  plugins: [
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-transform-runtime", { regenerator: true }]
  ]
};
