const { createDefaultPreset } = require("ts-jest");

// 1. This line imports the `createDefaultPreset` function from ts-jest.
//    This function returns a complete, standard Jest configuration object
//    that ts-jest recommends.
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // 2. Sets the test environment to Node.js, which is appropriate for this backend/CLI-style code.
  testEnvironment: "node",

  // 3. This is the key part. Instead of inheriting all settings from a preset,
  //    you are explicitly defining the `transform` property.
  transform: {
    // 4. You are taking ONLY the `transform` part of the default ts-jest preset
    //    and merging it into your configuration. The `transform` object tells
    //    Jest how to handle different file types. For ts-jest, it typically looks like:
    //    {
    //      '^.+\\.tsx?$': ['ts-jest', { /* default options */ }]
    //    }
    ...tsJestTransformCfg,
  },
};