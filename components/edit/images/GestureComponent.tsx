import React from "react";
import { Component } from "@/type/store";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";
import Feather from "@expo/vector-icons/Feather";
import { scale } from "react-native-size-matters";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";

const BTN_OPTION_SIZE = scale(12);

const RotateGestureComponent: React.FC<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  component: Component;
  step: number;
  children: React.ReactNode;
}> = ({ left, right, top, bottom, component, step, children }) => {
  const position: ViewStyle = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
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
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[position]}>
        <Box className="p-4 bg-white/54 rounded-full">{children}</Box>
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

  const race = Gesture.Exclusive(Gesture.Simultaneous(pinch, pan, rotation));

  const size: ViewStyle = React.useMemo(
    () => ({
      width: component.size?.width || 1,
      height: component.size?.height || 1,
      position: "absolute",
      zIndex: GESTURE_Z_INDEX,
    }),
    [component]
  );

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
      {
        scale: component.scale.value,
      },
    ] as never,
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${component.rotate.value}rad`,
      },
    ] as never,
  }));

  return (
    <Animated.View style={[size, translateStyle]}>
      <GestureDetector gesture={race}>
        <Animated.View style={[size, rotationStyle]}>
          <Box className="flex-1 border-dotted border border-secondary-900" />
        </Animated.View>
      </GestureDetector>
      <RotateGestureComponent
        step={0.1}
        component={component}
        right={scale(15)}
        top={component.size.height / 2 - BTN_OPTION_SIZE / 2}
      >
        <Feather name="rotate-cw" size={BTN_OPTION_SIZE} color="black" />
      </RotateGestureComponent>
      <RotateGestureComponent
        step={-0.1}
        component={component}
        left={scale(15)}
        top={component.size.height / 2 - BTN_OPTION_SIZE / 2}
      >
        <Feather name="rotate-ccw" size={BTN_OPTION_SIZE} color="black" />
      </RotateGestureComponent>
    </Animated.View>
  );
};

export default GestureComponent;
