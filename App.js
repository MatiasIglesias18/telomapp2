import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { initFirebase } from "./src/utils";
import 'expo-dev-client';
import "react-native-get-random-values";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "Warning: Async Storage has been extracted from react-native core",
]);

export default function App() {
  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
    </>
  );
}
