import React from "react";
import { Component, FitSize, MatrixIndex, PaintMatrix } from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ViewStyle, useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { COLOR, GESTURE_Z_INDEX, PAINT_WEIGHT } from "@/constants/Workspace";
import usePositionXY from "@/hooks/usePosition";
import {
  getComponentTransform,
  hasIndex,
  resizeComponentFitWorkspace,
  rootTranslate,
  updateComponentTransform,
} from "@/utils";
import { updatePaintStatus } from "@/hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import { KalmanFilter } from "@/services/kalmanFilter";

const GesturePaintComponent: React.FC<{
  component: Component;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const isTranslateVisible = useSharedValue(false);
  const data = React.useRef(component.data as PaintMatrix);
  const prevTranslate = usePositionXY({
    x: getComponentTransform(component, MatrixIndex.TRANSLATE_X),
    y: getComponentTransform(component, MatrixIndex.TRANSLATE_Y),
  });

  const rootX = useDerivedValue(() => (width - rootSize.width.value) / 2);

  const rootY = useDerivedValue(() => (height - rootSize.height.value) / 2);

  const kalmanX = React.useRef(new KalmanFilter({ R: 0.015, Q: 0.3 }));

  const kalmanY = React.useRef(new KalmanFilter({ R: 0.015, Q: 0.3 }));

  const tap = Gesture.Tap()
    .onBegin((event) => {
      if (!isTranslateVisible.value) {
        kalmanX.current.clear();
        kalmanY.current.clear();
        const color = component.params.lastColor ?? COLOR[0][1];
        const weight = component.params.lastWeight ?? PAINT_WEIGHT[0];
        const x = (event.absoluteX - rootX.value) / rootSize.scale.value;
        const y = (event.absoluteY - rootY.value) / rootSize.scale.value;
        data.current.push([color, weight, x, y]);
        updatePaintStatus(
          queryClient,
          `MOVE-TO-${x}-${y}`,
          index,
          data.current
        );
        return;
      }
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onBegin(() => {
      if (!isTranslateVisible.value) {
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
        const x = (event.absoluteX - rootX.value) / rootSize.scale.value;
        const y = (event.absoluteY - rootY.value) / rootSize.scale.value;
        const list = data.current[data.current.length - 1];
        const length = list.length;
        if (hasIndex(list, length - 1) && hasIndex(list, length - 2)) {
          const prevX = list[length - 2];
          const prevY = list[length - 1];
          const smoothX = kalmanX.current.filter(prevX as number);
          const smoothY = kalmanY.current.filter(prevY as number);
          data.current[data.current.length - 1][length - 2] = smoothX;
          data.current[data.current.length - 1][length - 1] = smoothY;
        }
        data.current[data.current.length - 1].push(x);
        data.current[data.current.length - 1].push(y);
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
    .onEnd(() => {})
    .runOnJS(true);

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

  const race = Gesture.Simultaneous(tap, pan);

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
