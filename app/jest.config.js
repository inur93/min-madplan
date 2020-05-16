module.exports = {
    moduleFileExtensions: [
     "js"
    ],
    transform: {
      "^.+\\.js?$": "babel-jest"
    },
    testMatch: [
     "**/*.(test|spec).(js|jsx)"
    ],
    globals: {
    
    },
    coveragePathIgnorePatterns: [
    "/node_modules/"
   ],
    coverageReporters: [
    "json",
     "lcov",
     "text",
     "text-summary"
    ],
    moduleNameMapper:{
     "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
     "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
    }
  };