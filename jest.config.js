module.exports = {
    rootDir: __dirname,
    "setupFiles": [
        "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": [],
    "testMatch": [
        "<rootDir>/src/**/__test__/*.test.js"
    ],
    "testEnvironment": "jest-environment-jsdom-fourteen",
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    },
    "transformIgnorePatterns": ['<rootDir>/node_modules/'],
    "moduleNameMapper": {
        "^react-native$": "react-native-web",
        "\\.(css|less|sass|scss)$": '<rootDir>/__mock__/styleMock.js'
    },
    "moduleFileExtensions": [
        "web.js",
        "js",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ],
    "watchPlugins": [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ]
}