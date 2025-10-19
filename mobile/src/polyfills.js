// Polyfills for React Native
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Additional polyfills that might be needed
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

if (typeof global.process === 'undefined') {
  global.process = require('process');
}
