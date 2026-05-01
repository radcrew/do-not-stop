const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        // Resolve from this app folder so CONTRACT_ADDRESS loads even if Metro’s cwd is not `mobile/`.
        path: path.resolve(__dirname, '.env'),
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
