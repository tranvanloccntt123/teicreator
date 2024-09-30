import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";
import { GESTURE_TAP_Z_INDEX } from "@/constants/Workspace";
import { setCurrentComponent } from "@/hooks/useWorkspace";
import {
  getComponentTransform,
  resizeComponentFitWorkspace,
  rootTranslate,
} from "@/utils";
import { useWindowDimensions } from "react-native";

const GestureTapComponent: React.FC<{
  component: Component;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const tap = Gesture.Tap()
    .onEnd(() => {
      if (component.id) {
        setCurrentComponent(component.id);
      }
    })
    .runOnJS(true);

  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );

  const componentStyle: ViewStyle = React.useMemo(
    () => ({
      width: size?.width || 1,
      height: size?.height || 1,
      position: "absolute",
      zIndex: GESTURE_TAP_Z_INDEX + index,
    }),
    [component]
  );

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).x + getComponentTransform(component, MatrixIndex.TRANSLATE_X),
      },
      {
        translateY:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).y + getComponentTransform(component, MatrixIndex.TRANSLATE_Y),
      },
      {
        rotate: `${getComponentTransform(component, MatrixIndex.ROTATE)}rad`,
      },
      {
        scale: getComponentTransform(component, MatrixIndex.SCALE),
      },
    ] as never,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[componentStyle, style]} />
    </GestureDetector>
  );
};

export default GestureTapComponent;
