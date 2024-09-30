import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { ScaledSheet } from "react-native-size-matters";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import AntDesign from "@expo/vector-icons/AntDesign";
import { deleteComponentById } from "@/hooks/useWorkspace";
import usePositionXY from "@/hooks/usePosition";
import {
  BTN_OPTION_ICON_SIZE,
  BTN_OPTION_SIZE,
  MAX_SCALE,
  MIN_SCALE,
} from "@/constants/EditImage";
import GestureRotateComponent from "./components/GestureRotateComponent";
import GestureResizeComponent from "./components/GestureResizeComponent";
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
  const size = useDerivedValue(() =>
    resizeComponentFitWorkspace(component, rootSize.scale)
  );
  const deleteCurrentComponent = () => {
    deleteComponentById(component.id);
  };
  const tap = Gesture.Tap()
    .onEnd(() => {
      deleteCurrentComponent();
    })
    .runOnJS(true);
  const position = useAnimatedStyle(() => ({
    position: "absolute",
    top: size.value.height / 2 - BTN_OPTION_SIZE / 2,
    left: size.value.width / 2 - BTN_OPTION_SIZE / 2,
    zIndex: GESTURE_Z_INDEX + 2,
  }));
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
    getComponentTransform(component, MatrixIndex.SCALE, rootSize.scale.value)
  );
  const prevTranslate = usePositionXY({
    x: getComponentTransform(
      component,
      MatrixIndex.TRANSLATE_X,
      rootSize.scale.value
    ),
    y: getComponentTransform(
      component,
      MatrixIndex.TRANSLATE_Y,
      rootSize.scale.value
    ),
  });
  const prevRotate = useSharedValue(
    getComponentTransform(component, MatrixIndex.ROTATE)
  );

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      prevScale.value = getComponentTransform(component, MatrixIndex.SCALE);
    })
    .onUpdate((event) => {
      updateComponentTransform(
        component,
        MatrixIndex.SCALE,
        clamp(prevScale.value * event.scale, MIN_SCALE, MAX_SCALE),
        rootSize.scale.value
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = getComponentTransform(
        component,
        MatrixIndex.TRANSLATE_X,
        rootSize.scale.value
      );
      prevTranslate.y.value = getComponentTransform(
        component,
        MatrixIndex.TRANSLATE_Y,
        rootSize.scale.value
      );
    })
    .onUpdate((event) => {
      updateComponentTransform(
        component,
        MatrixIndex.TRANSLATE_X,
        prevTranslate.x.value + event.translationX,
        rootSize.scale.value
      );
      updateComponentTransform(
        component,
        MatrixIndex.TRANSLATE_Y,
        prevTranslate.y.value + event.translationY,
        rootSize.scale.value
      );
    })
    .runOnJS(true);

  const rotation = Gesture.Rotation()
    .onBegin(() => {
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

  const size = useDerivedValue(() =>
    resizeComponentFitWorkspace(component, rootSize.scale)
  );

  const componentSize = useAnimatedStyle(() => ({
    width: size?.value?.width || 1,
    height: size?.value?.height || 1,
    position: "absolute",
    zIndex: GESTURE_Z_INDEX + index,
  }));

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).x +
          getComponentTransform(
            component,
            MatrixIndex.TRANSLATE_X,
            rootSize.scale.value
          ),
      },
      {
        translateY:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).y +
          getComponentTransform(
            component,
            MatrixIndex.TRANSLATE_Y,
            rootSize.scale.value
          ),
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
