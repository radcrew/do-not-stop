const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    // Include the monorepo root so Metro can watch and resolve symlinked deps
    watchFolders: [path.resolve(__dirname, '..')],
    resolver: {
        // Enable resolving through pnpm symlinks and package "exports"
        unstable_enableSymlinks: true,
        unstable_enablePackageExports: true,
        // Always prefer the app's own node_modules for dependencies
        extraNodeModules: new Proxy(
            {},
            {
                get: (_target, name) =>
                    path.join(__dirname, 'node_modules', String(name)),
            }
        ),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);