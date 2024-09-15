import React from "react";
import { Component, FitSize } from "@/type/store";
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";
import { ScaledSheet } from "react-native-size-matters";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import AntDesign from "@expo/vector-icons/AntDesign";
import { deleteComponentById } from "@/hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import usePositionXY from "@/hooks/usePosition";
import {
  BTN_OPTION_ICON_SIZE,
  BTN_OPTION_SIZE,
  MAX_SCALE,
  MIN_SCALE,
} from "@/constants/EditImage";
import GestureRotateComponent from "./GestureRotateComponent";
import GestureResizeComponent from "./GestureResizeComponent";
import { resizeComponentFitWorkspace } from "@/utils";

const TrashComponent: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const queryClient = useQueryClient();
  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );
  const deleteCurrentComponent = () => {
    deleteComponentById(component.id, queryClient);
  };
  const tap = Gesture.Tap()
    .onEnd(() => {
      deleteCurrentComponent();
    })
    .runOnJS(true);
  const position: ViewStyle = {
    position: "absolute",
    top: size.height / 2 - BTN_OPTION_SIZE / 2,
    left: size.width / 2 - BTN_OPTION_SIZE / 2,
    zIndex: GESTURE_Z_INDEX + 2,
  };
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[position]}>
        <Box className="bg-white/54 rounded-full" style={styles.icons}>
          <AntDesign name="delete" size={BTN_OPTION_ICON_SIZE} color="black" />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

const GestureComponent: React.FC<{
  component: Component;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const prevScale = useSharedValue(component.scale.value);
  const prevTranslate = usePositionXY({
    x: component.translateX.value,
    y: component.translateY.value,
  });
  const prevRotate = useSharedValue(component.rotate.value);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      prevScale.value = component.scale.value;
    })
    .onUpdate((event) => {
      component.scale.value = clamp(
        prevScale.value * event.scale,
        MIN_SCALE,
        MAX_SCALE
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onStart(() => {
      if (Platform.OS !== "web") {
        prevTranslate.x.value = component.translateX.value;
        prevTranslate.y.value = component.translateY.value;
      }
    })
    .onBegin(() => {
      if (Platform.OS === "web") {
        prevTranslate.x.value = component.translateX.value;
        prevTranslate.y.value = component.translateY.value;
      }
    })
    .onUpdate((event) => {
      component.translateX.value = prevTranslate.x.value + event.translationX;
      component.translateY.value = prevTranslate.y.value + event.translationY;
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

  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );

  const componentSize: ViewStyle = React.useMemo(
    () => ({
      width: size?.width || 1,
      height: size?.height || 1,
      position: "absolute",
      zIndex: GESTURE_Z_INDEX + index,
    }),
    [component]
  );

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
    ] as never,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${component.rotate.value}rad`,
      },
    ] as never,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: component.scale.value,
      },
    ],
  }));

  return (
    <Animated.View style={[componentSize, translateStyle]}>
      <Animated.View style={[componentSize, contentStyle]}>
        <GestureDetector gesture={race}>
          <Animated.View style={[componentSize, scaleStyle]}>
            <Box className="flex-1 border-dotted border border-secondary-900" />
          </Animated.View>
        </GestureDetector>
        <GestureResizeComponent rootSize={rootSize} component={component} />
      </Animated.View>
      <GestureRotateComponent
        rootSize={rootSize}
        step={0.1}
        component={component}
      />
      <TrashComponent rootSize={rootSize} component={component} />
    </Animated.View>
  );
};

export default GestureComponent;

const styles = ScaledSheet.create({
  icons: {
    width: BTN_OPTION_SIZE,
    height: BTN_OPTION_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
