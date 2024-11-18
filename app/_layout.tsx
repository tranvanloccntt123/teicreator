import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
//Query Client
import { QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import AppStyles from "@/assets/css";
import queryClient from "@/services/queryClient";
import { scale } from "react-native-size-matters";
import * as Updates from "expo-updates";
import LoadingProvider from "@/components/loading/LoadingProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const {
    currentlyRunning: _currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
  } = Updates.useUpdates();

  //REMOTE UPDATE
  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  React.useEffect(() => {
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync();
    }
  }, [isUpdateAvailable]);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <View style={AppStyles.container}>
            <View style={AppStyles.container}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <LoadingProvider>
                  <Slot />
                </LoadingProvider>
              </ThemeProvider>
            </View>
          </View>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  developmentTxt: {
    fontSize: 12,
  },
  menuContext: {
    position: "absolute",
    width: scale(70),
    zIndex: -1,
  },
});
