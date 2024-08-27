import React from "react";
import { Component } from "@/type/store";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";

const GestureComponent: React.FC<{ component: Component }> = ({
  component,
}) => {
  const prevScale = useSharedValue(component.scale.value);
  const prevTranslationX = useSharedValue(component.translateX.value);
  const prevTranslationY = useSharedValue(component.translateY.value);
  const prevRotate = useSharedValue(component.rotate.value);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      prevScale.value = component.scale.value;
    })
    .onUpdate((event) => {
      component.scale.value = clamp(prevScale.value * event.scale, 0.5, 3.0);
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onStart(() => {
      if (Platform.OS !== "web") {
        prevTranslationX.value = component.translateX.value;
        prevTranslationY.value = component.translateY.value;
      }
    })
    .onBegin(() => {
      if (Platform.OS === "web") {
        prevTranslationX.value = component.translateX.value;
        prevTranslationY.value = component.translateY.value;
      }
    })
    .onUpdate((event) => {
      component.translateX.value = prevTranslationX.value + event.translationX;
      component.translateY.value = prevTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      console.log("END PAN");
    })
    .runOnJS(true);

  const rotation = Gesture.Rotation()
    .onStart(() => {
      prevRotate.value = component.rotate.value;
    })
    .onUpdate((event) => {
      component.rotate.value = prevRotate.value + event.rotation;
    });

  //   const tap = Gesture.Tap()
  //     .onEnd(() => {
  //       //
  //     })
  //     .runOnJS(true);

  const race = Gesture.Exclusive(Gesture.Simultaneous(pinch, pan, rotation));

  const size: ViewStyle = React.useMemo(
    () => ({
      width: component.size?.width || 1,
      height: component.size?.height || 1,
    }),
    [component]
  );

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
      {
        scale: component.scale.value,
      },
    ] as never,
  }));

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[size, style]}>
        <Box className="flex-1 border-dotted border border-secondary-900" />
      </Animated.View>
    </GestureDetector>
  );
};

export default GestureComponent;
