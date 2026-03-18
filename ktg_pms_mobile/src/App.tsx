import AuthProvider from "~/contexts/AuthContext";
import ModalProvider from "~/contexts/ModalContext";
import RootNavigator from "~/navigation/RootNavigator";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { StatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment-timezone";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import ThemeProvider from "~/contexts/ThemeContext";
import SheetProvider from "~/contexts/SheetContext";

SplashScreen.preventAutoHideAsync();

const DEFAULT_TZ = "Asia/Ho_Chi_Minh";

moment.tz.setDefault(DEFAULT_TZ);

moment.locale("vi");

moment().tz(DEFAULT_TZ);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000, // Increase gcTime to 5 minutes
      refetchInterval: 45 * 1000, // Add 45s auto refetch
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <BottomSheetModalProvider>
                <SheetProvider>
                  <AuthProvider>
                    <StatusBar
                      barStyle="dark-content"
                      backgroundColor="transparent"
                      translucent
                    />
                    <RootNavigator />
                    <FlashMessage position="top" floating={true} />
                  </AuthProvider>
                </SheetProvider>
              </BottomSheetModalProvider>
            </ModalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
