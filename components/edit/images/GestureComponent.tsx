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
import Feather from "@expo/vector-icons/Feather";
import { scale } from "react-native-size-matters";
import { radBetween2Vector } from "@/utils";

const RotateGestureComponent: React.FC<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  component: Component;
}> = ({ left, right, top, bottom, component }) => {
  const position: ViewStyle = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
  };
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevRotation = useSharedValue(component.rotate.value);
  const pan = Gesture.Pan()
    .onStart((event) => {
      if (Platform.OS !== "web") {
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
        prevRotation.value = component.rotate.value;
      }
    })
    .onBegin(() => {
      if (Platform.OS === "web") {
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
        prevRotation.value = component.rotate.value;
      }
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
      component.rotate.value = prevRotation.value + radBetween2Vector(
        {
          x: prevTranslationX.value,
          y: prevTranslationY.value,
        },
        {
          x: translationX.value,
          y: translationY.value,
        }
      );
    })
    .runOnJS(true);
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[position]}>
        <Feather name="rotate-cw" size={24} color="black" />
      </Animated.View>
    </GestureDetector>
  );
};

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
      {
        rotate: `${component.rotate.value}rad`,
      },
    ] as never,
  }));

  return (
    <Animated.View style={[size, style]}>
      <GestureDetector gesture={race}>
        <Box className="flex-1 border-dotted border border-secondary-900" />
      </GestureDetector>
      <RotateGestureComponent
        component={component}
        right={-scale(10)}
        top={-scale(10)}
      />
    </Animated.View>
  );
};

export default GestureComponent;
