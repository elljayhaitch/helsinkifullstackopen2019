module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    "**/*.js",
    "!**/app.js", "!**/index.js", "!**/jest.config.js",
    "!**/coverage/**", "!**/utils/**"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}