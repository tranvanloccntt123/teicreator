import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import { clearCurrentComponent } from "@/hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleProp, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native-size-matters";

const GestureTapClearComponent = () => {
  const queryClient = useQueryClient();
  const tap = Gesture.Tap().onEnd(() => {
    clearCurrentComponent(queryClient);
  }).runOnJS(true);
  const style = React.useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: GESTURE_Z_INDEX - 1,
    }),
    []
  );

  return (
    <GestureDetector gesture={tap}>
      <View style={style as never} />
    </GestureDetector>
  );
};

export default GestureTapClearComponent;
