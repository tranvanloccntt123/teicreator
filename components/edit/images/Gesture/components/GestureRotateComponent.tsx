import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Box } from "@/components/ui/box";
import Feather from "@expo/vector-icons/Feather";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import usePositionXY from "@/hooks/usePosition";
import {
  componentSize,
  getComponentTransform,
  resizeComponentFitWorkspace,
  updateComponentTransform,
  vectorFromRadians,
} from "@/utils";
import { BTN_OPTION_ICON_SIZE, BTN_OPTION_SIZE } from "@/constants/EditImage";
import { ScaledSheet } from "react-native-size-matters";

const GestureRotateComponent: React.FC<{
  component: Component;
  step: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, step, rootSize }) => {
  const size = useDerivedValue(() =>
    resizeComponentFitWorkspace(component, rootSize.scale)
  );
  const R = useDerivedValue(
    () =>
      componentSize({
        ...component,
        size: {
          width: size.value.width,
          height: size.value.height,
        },
      }).width /
        2 +
      BTN_OPTION_SIZE / 2
  );
  const prevTranslate = usePositionXY({ x: 0, y: 0 });
  const prevRotate = useSharedValue(
    getComponentTransform(component, MatrixIndex.ROTATE)
  );
  const positionXY = useDerivedValue(() =>
    vectorFromRadians(
      R.value,
      getComponentTransform(component, MatrixIndex.ROTATE)
    )
  );

  const position = useAnimatedStyle(() => ({
    position: "absolute",
    top: size.value.height / 2 - BTN_OPTION_SIZE / 2,
    left: size.value.width / 2 - BTN_OPTION_SIZE / 2,
    zIndex: GESTURE_Z_INDEX + 1,
  }));

  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = positionXY.value.x;
      prevTranslate.y.value = positionXY.value.y;
      prevRotate.value = getComponentTransform(component, MatrixIndex.ROTATE);
    })
    .onUpdate((event) => {
      const translateX = prevTranslate.x.value + event.translationX;
      const translateY = prevTranslate.y.value + event.translationY;
      const rad = Math.atan2(translateY, translateX);
      updateComponentTransform(
        component,
        MatrixIndex.ROTATE,
        prevRotate.value + rad
      );
    })
    .runOnJS(true);

  const race = Gesture.Simultaneous(pan);
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
