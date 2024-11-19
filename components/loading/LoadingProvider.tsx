import React from "react";
import { Box } from "../ui/box";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { Center } from "../ui/center";
import LottieView from "lottie-react-native";
import LottieAnimation from "@/assets/animations";

const loadingContext = React.createContext<{
  show: () => any;
  hide: () => any;
}>({
  show() {},
  hide() {},
});

export const useLoading = () => {
  const loading = React.useContext(loadingContext);
  return loading;
};

const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { width, height } = useWindowDimensions();
  const loading = useSharedValue(0);
  const showLoading = () => {
    cancelAnimation(loading);
    loading.value = withTiming(1, { duration: 200 });
  };
  const hideLoading = () => {
    cancelAnimation(loading);
    loading.value = withTiming(0, { duration: 200 });
  };
  const containerStyle = useAnimatedStyle(() => ({
    opacity: loading.value,
    width: interpolate(loading.value, [0, 0.01, 1], [0, width, width]),
    height: interpolate(loading.value, [0, 0.01, 1], [0, height, height]),
    transform: [
      {
        scale: interpolate(loading.value, [0, 0.01, 1], [0, 1, 1]),
      },
    ],
  }));
  return (
    <loadingContext.Provider
      value={{
        show: showLoading,
        hide: hideLoading,
      }}
    >
      <Box className="flex-1">{children}</Box>
      <Animated.View style={[styles.loadingContainer, containerStyle]}>
        <Center className="bg-black/[.2] flex-1">
          <Box
            className="rounded-md p-4 bg-white"
            style={styles.contentContainer}
          >
            <Center className="flex-1">
              <LottieView
                autoPlay
                style={styles.loading}
                source={LottieAnimation.LOADING}
                loop
                colorFilters={[
                  { keypath: "Oval 3", color: "#FF8A80" },
                  { keypath: "Oval", color: "#FFEBEE" },
                ]}
              />
            </Center>
          </Box>
        </Center>
      </Animated.View>
    </loadingContext.Provider>
  );
};

export default LoadingProvider;

const styles = ScaledSheet.create({
  loadingContainer: {
    zIndex: 2,
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    overflow: "hidden",
    transform: [
      {
        scale: 0,
      },
    ],
  },
  contentContainer: {
    width: "200@s",
    height: "200@s",
  },
  loading: {
    width: "100@s",
    height: "100@s",
  },
});
