import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
//Query Client
import { QueryClientProvider } from "@tanstack/react-query";
import { Pressable, StyleSheet, View } from "react-native";
import AppStyles from "@/assets/css";
import queryClient from "@/services/queryClient";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const debugLogged = React.useRef<boolean>(false);
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
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen
                    name="upload-image"
                    options={{ title: "Upload Image" }}
                  />
                  <Stack.Screen
                    name="create-workspace"
                    options={{
                      title: "Create Workspace",
                      presentation: "transparentModal",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="workspace"
                    options={{
                      title: "Workspace",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="log"
                    options={{
                      title: "DEV Log",
                      headerShown: false,
                    }}
                  />
                </Stack>
              </ThemeProvider>
            </View>
            {__DEV__ && (
              <Box className="px-4 py-2">
                <Pressable
                  onPress={() => {
                    router
                    if (debugLogged.current) {
                      router.canGoBack() && router.back();
                    } else {
                      router.navigate("/log");
                    }
                  }}
                >
                  <Text style={styles.developmentTxt}>Development</Text>
                </Pressable>
              </Box>
            )}
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
});
