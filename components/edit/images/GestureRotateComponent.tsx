import React from "react";
import { Component, FitSize } from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";
import Feather from "@expo/vector-icons/Feather";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import usePositionXY from "@/hooks/usePosition";
import {
  componentSize,
  resizeComponentFitWorkspace,
  vectorFromRadians,
  vectorOnCircleLine,
} from "@/utils";
import { BTN_OPTION_ICON_SIZE, BTN_OPTION_SIZE } from "@/constants/EditImage";
import { ScaledSheet } from "react-native-size-matters";

const GestureRotateComponent: React.FC<{
  component: Component;
  step: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, step, rootSize }) => {
  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );
  const R = useDerivedValue(
    () =>
      componentSize({
        ...component,
        size: {
          width: size.width,
          height: size.height,
        },
      }).width /
        2 +
      BTN_OPTION_SIZE / 2
  );
  const prevTranslate = usePositionXY({ x: 0, y: 0 });
  const prevRotate = useSharedValue(component.rotate.value);
  const positionXY = useDerivedValue(() =>
    vectorFromRadians(R.value, component.rotate.value)
  );

  const position: ViewStyle = {
    position: "absolute",
    top: size.height / 2 - BTN_OPTION_SIZE / 2,
    left: size.width / 2 - BTN_OPTION_SIZE / 2,
    zIndex: GESTURE_Z_INDEX + 1,
  };
  const tap = Gesture.Tap()
    .onEnd(() => {
      //
      component.rotate.value = withTiming(component.rotate.value + step, {
        duration: 50,
      });
    })
    .runOnJS(true);
  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = positionXY.value.x;
      prevTranslate.y.value = positionXY.value.y;
      prevRotate.value = component.rotate.value;
    })
    .onUpdate((event) => {
      const translateX = prevTranslate.x.value + event.translationX;
      const translateY = prevTranslate.y.value + event.translationY;
      const rad = Math.atan2(translateY, translateX);
      component.rotate.value = prevRotate.value + rad;
    })
    .runOnJS(true);
  const race = Gesture.Simultaneous(tap, pan);
  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: positionXY.value.x,
        },
        {
          translateY: positionXY.value.y,
        },
      ] as never,
    };
  });
  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[position, transformStyle]}>
        <Box className="bg-white/54 rounded-full" style={styles.icons}>
          <Feather name="rotate-cw" size={BTN_OPTION_ICON_SIZE} color="black" />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

export default GestureRotateComponent;

const styles = ScaledSheet.create({
  icons: {
    width: BTN_OPTION_SIZE,
    height: BTN_OPTION_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
