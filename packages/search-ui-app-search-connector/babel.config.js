const presets = [
  [
    "@babel/env",
    {
      // Because we are using @babel/polyfill, because we have old browser
      // targets set, this will optimize the polyfills that are actually
      // imported.
      useBuiltIns: "entry",
      targets: {
        // Setting target browsers like this, if they span back far enough,
        // requires adding @babel/polyfill
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
  plugins: ["@babel/plugin-proposal-class-properties"]
};
