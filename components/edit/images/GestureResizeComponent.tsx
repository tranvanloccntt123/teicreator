import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import Ionicons from "@expo/vector-icons/Ionicons";
import usePositionXY from "@/hooks/usePosition";
import {
  distanceBetween2Vector,
  getComponentTransform,
  resizeComponentFitWorkspace,
  resizePosition,
  updateComponentTransform,
} from "@/utils";
import {
  BTN_OPTION_ICON_SIZE,
  BTN_OPTION_SIZE,
  MAX_SCALE,
  MIN_SCALE,
} from "@/constants/EditImage";
import { ScaledSheet } from "react-native-size-matters";

const GestureResizeComponent: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );
  const prevTranslate = usePositionXY({ x: 0, y: 0 });
  const prevScale = useSharedValue(
    getComponentTransform(component, MatrixIndex.SCALE)
  );
  const positionXY = useDerivedValue(() => {
    return {
      x: resizePosition({
        ...component,
        size: {
          width: size.width,
          height: size.height,
        },
      }).x,
      y: resizePosition({
        ...component,
        size: {
          width: size.width,
          height: size.height,
        },
      }).y,
    };
  });
  const position: ViewStyle = {
    position: "absolute",
    top: size.height / 2 - BTN_OPTION_SIZE / 2,
    left: size.width / 2 - BTN_OPTION_SIZE / 2,
    zIndex: GESTURE_Z_INDEX + 2,
  };
  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = positionXY.value.x;
      prevTranslate.y.value = positionXY.value.y;
      prevScale.value = getComponentTransform(component, MatrixIndex.SCALE);
    })
    .onUpdate((event) => {
      //TODO:
      const translateX = prevTranslate.x.value + event.translationX;
      const translateY = prevTranslate.y.value + event.translationY;
      //END TODO:
      //clamp(prevScale.value * event.scale, 0.5, 3.0);
      const distance = distanceBetween2Vector(
        { x: translateX, y: translateY },
        { x: prevTranslate.x.value, y: prevTranslate.y.value }
      );
      const distancePercent =
        (distance / size.width + distance / size.height) / 2;
      const oldDistance = distanceBetween2Vector(
        { x: 0, y: 0 },
        { x: prevTranslate.x.value, y: prevTranslate.y.value }
      );
      const newDistance = distanceBetween2Vector(
        { x: translateX, y: translateY },
        { x: 0, y: 0 }
      );
      const isScaleLarge = newDistance > oldDistance;
      const scaling =
        prevScale.value - (!isScaleLarge ? 1 : -1) * distancePercent;
      if (scaling >= MIN_SCALE || scaling <= MAX_SCALE) {
        updateComponentTransform(
          component,
          MatrixIndex.SCALE,
          clamp(scaling, MIN_SCALE, MAX_SCALE)
        );
      }
    })
    .runOnJS(true);

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
    <GestureDetector gesture={pan}>
      <Animated.View style={[position, transformStyle]}>
        <Box className="bg-white/54 rounded-full" style={styles.icons}>
          <Ionicons name="resize" size={BTN_OPTION_ICON_SIZE} color="black" />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

export default GestureResizeComponent;

const styles = ScaledSheet.create({
  icons: {
    width: BTN_OPTION_SIZE,
    height: BTN_OPTION_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
