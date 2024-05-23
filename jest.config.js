module.exports = {
    testMatch: ["**/test/*.test.js"],
    transform: {
        "^.+\\.js$": "babel-jest",
     },
    setupFiles: ["<rootDir>/.jest/env.js"],
 };