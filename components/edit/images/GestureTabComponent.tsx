import React from "react";
import { Component, FitSize } from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";
import { GESTURE_TAP_Z_INDEX } from "@/constants/Workspace";
import { useQueryClient } from "@tanstack/react-query";
import { setCurrentComponent } from "@/hooks/useWorkspace";
import { resizeComponentFitWorkspace } from "@/utils";

const GestureTabComponent: React.FC<{
  component: Component;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const queryClient = useQueryClient();
  const tap = Gesture.Tap()
    .onEnd(() => {
      if (component.id) {
        setCurrentComponent(component.id, queryClient);
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
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
      {
        rotate: `${component.rotate.value}rad`,
      },
      {
        scale: component.scale.value,
      },
    ] as never,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[componentStyle, style]} />
    </GestureDetector>
  );
};

export default GestureTabComponent;
