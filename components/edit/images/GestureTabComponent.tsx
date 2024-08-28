import React from "react";
import { Component } from "@/type/store";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";
import { COMPONENT_Z_INDEX } from "@/constants/Workspace";
import { useQueryClient } from "@tanstack/react-query";
import { setCurrentComponent } from "@/hooks/useCurrentWorkspace";

const GestureTabComponent: React.FC<{
  component: Component;
  index: number;
}> = ({ component, index }) => {
  const queryClient = useQueryClient();
  const tap = Gesture.Tap().onEnd(() => {
    setCurrentComponent(component.id, queryClient);
  });

  const size: ViewStyle = React.useMemo(
    () => ({
      width: component.size?.width || 1,
      height: component.size?.height || 1,
      position: "absolute",
      zIndex: COMPONENT_Z_INDEX + index,
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
      <Animated.View style={[size, style]} />
    </GestureDetector>
  );
};

export default GestureTabComponent;
