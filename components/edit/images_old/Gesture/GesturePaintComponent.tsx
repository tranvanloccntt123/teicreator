import React from "react";
import {
  EditComponent,
  FitSize,
  MatrixIndex,
  PaintMatrix,
  PaintType,
} from "@/type/store";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { COLOR, GESTURE_Z_INDEX, PAINT_WEIGHT } from "@/constants/Workspace";
import usePositionXY from "@/hooks/usePosition";
import {
  getComponentTransform,
  hasIndex,
  moveToLinePaint,
  resizeComponentFitWorkspace,
  rootTranslate,
  startLinePaint,
  updateComponentTransform,
  updateLastXYLinePaint,
} from "@/utils";
import { KalmanFilter } from "@/services/kalmanFilter";

const GesturePaintComponent: React.FC<{
  component: EditComponent;
  index: number;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, index, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const isTranslateVisible = useSharedValue(false);
  const lastXY = React.useRef({ x: 0, y: 0 });
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

  const rootX = useDerivedValue(() => (width - rootSize.width.value) / 2);

  const rootY = useDerivedValue(() => (height - rootSize.height.value) / 2);

  const kalmanX = React.useRef(new KalmanFilter({ R: 0.015, Q: 0.3 }));

  const kalmanY = React.useRef(new KalmanFilter({ R: 0.015, Q: 0.3 }));

  const tap = Gesture.Tap()
    .onBegin((event) => {
      if (!isTranslateVisible.value) {
        kalmanX.current.clear();
        kalmanY.current.clear();
        const penType = component.params?.lastPainType ?? PaintType.PEN;
        const color = component.params.lastColor ?? COLOR[0][1];
        const weight = component.params.lastWeight ?? PAINT_WEIGHT[0];
        const x = (event.absoluteX - rootX.value) / rootSize.scale.value;
        const y = (event.absoluteY - rootY.value) / rootSize.scale.value;
        lastXY.current = { x, y };
        startLinePaint(color, weight, penType, x, y);
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
        const smoothX = kalmanX.current.filter(lastXY.current.x as number);
        const smoothY = kalmanY.current.filter(lastXY.current.y as number);
        updateLastXYLinePaint(smoothX, smoothY);
        moveToLinePaint(x, y);
        lastXY.current = { x, y };
        return;
      }
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
    .onEnd(() => {})
    .runOnJS(true);

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
