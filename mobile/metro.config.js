// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * Custom resolver to handle ZeroDev imports
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    if (moduleName.endsWith(".js")) {
      const tsModuleName = moduleName.replace(/\.js$/, ".ts");
      return context.resolveRequest(context, tsModuleName, platform);
    }
    throw error;
  }
};

module.exports = config;
