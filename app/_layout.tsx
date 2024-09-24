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
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
//Query Client
import { QueryClientProvider } from "@tanstack/react-query";
import { Pressable, StyleSheet, View } from "react-native";
import AppStyles from "@/assets/css";
import queryClient from "@/services/queryClient";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import usePositionXY from "@/hooks/usePosition";
import { scale } from "react-native-size-matters";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const MENU_Z_INDEX = 9999;

const AppNavigation = () => {
  const isMenuVisible = useSharedValue(false);
  const menuOpacity = useDerivedValue(() => (isMenuVisible.value ? 1 : 0));
  const position = usePositionXY({ x: 0, y: 0 });
  const tap = Gesture.Tap()
    .onEnd((e) => {
      if (isMenuVisible.value) {
        isMenuVisible.value = false;
      }
    })
    .runOnJS(true);
  const longPress = Gesture.LongPress()
    .onEnd((e) => {
      isMenuVisible.value = !isMenuVisible.value;
      position.x.value = e.x;
      position.y.value = e.y;
    })
    .runOnJS(true);
  const menuContextStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    zIndex: interpolate(menuOpacity.value, [0, 1], [-1, MENU_Z_INDEX]),
    top: position.y.value,
    left: position.x.value,
  }));
  const race = Gesture.Simultaneous(longPress, tap);
  return (
    <Box className="flex-1">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="upload-image" options={{ title: "Upload Image" }} />
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
      <Animated.View style={[styles.menuContext, menuContextStyle]}>
        <Box className="flex-1 bg-white shadow-md rounded-md p-2">
          <Pressable
            onPress={() => {
              router.navigate("/log");
              isMenuVisible.value = false;
            }}
          >
            <Text style={styles.developmentTxt}>Development</Text>
          </Pressable>
        </Box>
      </Animated.View>
    </Box>
  );
};

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
                <AppNavigation />
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
