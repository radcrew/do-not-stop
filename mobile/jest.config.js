module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest-setup.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs|mjs)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@dynamic-labs/.*)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "cjs", "json"],
  testEnvironment: "node",
};
