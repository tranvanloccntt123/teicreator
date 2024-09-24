import React from "react";
import { Component, FitSize, MatrixIndex, PaintMatrix } from "@/type/store";
import Animated, {
  SharedValue,
  clamp,
  makeMutable,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle, useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import usePositionXY from "@/hooks/usePosition";
import { MAX_SCALE, MIN_SCALE } from "@/constants/EditImage";
import {
  getComponentTransform,
  resizeComponentFitWorkspace,
  rootTranslate,
  updateComponentTransform,
} from "@/utils";
import { ScaledSheet } from "react-native-size-matters";
import { updatePaintStatus } from "@/hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";

const GesturePaintComponent: React.FC<{
  component: Component;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const isTranslateVisible = useSharedValue(false);
  const lineIndex = React.useRef((component.data as PaintMatrix)?.length ?? 0);
  const data = React.useRef(component.data as PaintMatrix);
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
    .onBegin(() => {
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
    .onBegin((event) => {
      if (!isTranslateVisible.value) {
        if ((component.data as PaintMatrix).length <= lineIndex.current) {
          const x = event.absoluteX / rootSize.scale.value;
          const y = event.absoluteY / rootSize.scale.value;
          data.current.push([x, y]);
          updatePaintStatus(
            queryClient,
            `MOVE-TO-${x}-${y}`,
            index,
            data.current
          );
        }
        return;
      }
      prevTranslate.x.value = getComponentTransform(
        component,
        MatrixIndex.TRANSLATE_X
      );
      prevTranslate.y.value = getComponentTransform(
        component,
        MatrixIndex.TRANSLATE_Y
      );
    })
    .onUpdate((event) => {
      if (!isTranslateVisible.value) {
        const x = event.absoluteX / rootSize.scale.value;
        const y = event.absoluteY / rootSize.scale.value;
        data.current[lineIndex.current].push(x);
        data.current[lineIndex.current].push(y);
        updatePaintStatus(
          queryClient,
          `MOVE-TO-${x}-${y}`,
          index,
          data.current
        );
        return;
      }
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
    .onEnd(() => {
      lineIndex.current = lineIndex.current + 1;
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

  const race = Gesture.Simultaneous(pinch, pan, rotation);

  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[componentSize, translateStyle]}>
        <Animated.View style={[componentSize, contentStyle]}>
          <Animated.View style={[componentSize, scaleStyle]}>
            <Box className="flex-1 border-dotted border border-secondary-900" />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default GesturePaintComponent;

const styles = ScaledSheet.create({
  panContainer: {
    position: "absolute",
    zIndex: GESTURE_Z_INDEX,
    top: 0,
    left: 0,
    width: "4@s",
    height: "4@s",
    borderRadius: "4@s",
    borderWidth: 1,
  },
});
