const presets = [
  [
    "@babel/env",
    {
      targets: {
        browsers: ["last 2 versions", "> 5%"]
      },
      modules: process.env.BABEL_MODULES
        ? process.env.BABEL_MODULES
        : "commonjs" // babel's default is commonjs
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
