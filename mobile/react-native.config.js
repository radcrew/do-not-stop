module.exports = {
    dependencies: {
        'react-native-passkey': {
            platforms: {
                android: {
                    sourceDir: '../node_modules/react-native-passkey/android',
                    packageImportPath: 'import com.reactnativepasskey.PasskeyPackage;',
                    disable: true, // disable Android platform, other platforms will still autolink if provided
                },
            },
        },
    },
};
