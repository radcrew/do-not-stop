import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, ScrollView } from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ConnectButton from './components/ConnectButton';

function YourAppRootComponent() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppContent />
        </SafeAreaProvider>
    );
}

function AppContent() {
    const safeAreaInsets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container}>
            <NewAppScreen
                templateFileName="App.tsx"
                safeAreaInsets={safeAreaInsets}
            />

            {/* Example AppKit usage */}
            <ConnectButton />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default YourAppRootComponent;
