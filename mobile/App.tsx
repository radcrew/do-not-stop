import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Home } from "./src/Home";
import { client } from "./src/client";

const App: FC = () => (
  <SafeAreaProvider>
    <client.reactNative.WebView />
    <StatusBar style="auto" />

    <SafeAreaView style={styles.main}>
      <ScrollView>
        <Home />
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default App;
