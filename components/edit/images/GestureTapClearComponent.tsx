import { GESTURE_TAP_Z_INDEX } from "@/constants/Workspace";
import { clearCurrentComponent } from "@/hooks/useWorkspace";
import React from "react";
import { StyleProp, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle } from "react-native-size-matters";

const GestureTapClearComponent = () => {
  const tap = Gesture.Tap().onEnd(() => {
    clearCurrentComponent();
  }).runOnJS(true);
  const style = React.useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: GESTURE_TAP_Z_INDEX - 1,
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
