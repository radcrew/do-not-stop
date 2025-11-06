import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppKit } from '@reown/appkit-react-native';
import ConnectButton from './components/ConnectButton';

function AppRoot() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppContent />
        </SafeAreaProvider>
    );
}

function AppContent() {
    return (
        <ScrollView style={styles.container}>
            {/* Example AppKit usage */}
            <ConnectButton />

            {/* AppKit UI component for wallet connection */}
            <AppKit />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppRoot;
