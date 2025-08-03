// Register ts-node for .ts files
require("ts-node").register({
  transpileOnly: true, // optional, skips type-checking for faster startup
  compilerOptions: {
    lib: ["es6"],
    module: "commonjs",
    noImplicitReturns: true,
    outDir: "lib",
    sourceMap: true,
    target: "es6",
    declaration: true,
    strictNullChecks: true,
  },
  skipProject: true,
});

// Import the implementation (ts-node will handle the .ts file)
const { specBuilder } = require("./spec-builder.ts");

// Create a generator that dynamically imports marked when called
const generator = async (service) => {
  const { marked } = await import("marked");

  const renderer = new marked.Renderer();

  // Override paragraph rendering to return contents only
  renderer.paragraph = (text) => text.raw;

  marked.use({ renderer });

  const actualGenerator = specBuilder(marked);
  return actualGenerator(service);
};

module.exports = generator;
