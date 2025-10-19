const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        // Add support for .jsx files
        sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
        // Handle React Native specific modules
        platforms: ['ios', 'android', 'native', 'web'],
        // Ensure proper resolution of React Native modules
        unstable_enableSymlinks: false,
        unstable_enablePackageExports: false,
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
