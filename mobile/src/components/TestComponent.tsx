import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple test component to verify basic functionality
const TestComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Test Component</Text>
      <Text style={styles.subtitle}>If you can see this, React Native is working!</Text>
      <Text style={styles.info}>
        • React Native: ✅{'\n'}
        • TypeScript: ✅{'\n'}
        • Basic Setup: ✅
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TestComponent;

