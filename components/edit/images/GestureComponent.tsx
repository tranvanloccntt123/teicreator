import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, ViewStyle, useWindowDimensions } from "react-native";
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
import {
  getComponentTransform,
  resizeComponentFitWorkspace,
  rootTranslate,
  updateComponentTransform,
} from "@/utils";

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
  const { width, height } = useWindowDimensions();
  const prevScale = useSharedValue(
    getComponentTransform(component, MatrixIndex.SCALE)
  );
  const prevTranslate = usePositionXY({
    x: getComponentTransform(component, MatrixIndex.TRANSLATE_X),
    y: getComponentTransform(component, MatrixIndex.TRANSLATE_Y),
  });
  const prevRotate = useSharedValue(
    getComponentTransform(component, MatrixIndex.ROTATE)
  );

  const pinch = Gesture.Pinch()
    .onStart(() => {
      prevScale.value = getComponentTransform(component, MatrixIndex.SCALE);
    })
    .onUpdate((event) => {
      updateComponentTransform(
        component,
        MatrixIndex.SCALE,
        clamp(prevScale.value * event.scale, MIN_SCALE, MAX_SCALE)
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onStart(() => {
      if (Platform.OS !== "web") {
        prevTranslate.x.value = getComponentTransform(
          component,
          MatrixIndex.TRANSLATE_X
        );
        prevTranslate.y.value = getComponentTransform(
          component,
          MatrixIndex.TRANSLATE_Y
        );
      }
    })
    .onBegin(() => {
      if (Platform.OS === "web") {
        prevTranslate.x.value = getComponentTransform(
          component,
          MatrixIndex.TRANSLATE_X
        );
        prevTranslate.y.value = getComponentTransform(
          component,
          MatrixIndex.TRANSLATE_Y
        );
      }
    })
    .onUpdate((event) => {
      updateComponentTransform(
        component,
        MatrixIndex.TRANSLATE_X,
        prevTranslate.x.value + event.translationX
      );
      updateComponentTransform(
        component,
        MatrixIndex.TRANSLATE_Y,
        prevTranslate.y.value + event.translationY
      );
    })
    .runOnJS(true);

  const rotation = Gesture.Rotation()
    .onStart(() => {
      prevRotate.value = getComponentTransform(component, MatrixIndex.ROTATE);
    })
    .onUpdate((event) => {
      updateComponentTransform(
        component,
        MatrixIndex.ROTATE,
        prevRotate.value + event.rotation
      );
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
    ] as never,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${getComponentTransform(component, MatrixIndex.ROTATE)}rad`,
      },
    ] as never,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: getComponentTransform(component, MatrixIndex.SCALE),
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
