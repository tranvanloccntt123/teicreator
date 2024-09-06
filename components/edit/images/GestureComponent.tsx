import React from "react";
import { Component } from "@/type/store";
import Animated, {
  clamp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, ViewStyle } from "react-native";
import { Box } from "@/components/ui/box";
import Feather from "@expo/vector-icons/Feather";
import { ScaledSheet, scale } from "react-native-size-matters";
import { GESTURE_Z_INDEX } from "@/constants/Workspace";
import AntDesign from "@expo/vector-icons/AntDesign";
import { deleteComponentById } from "@/hooks/useCurrentWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import usePositionXY from "@/hooks/usePosition";
import {
  componentSize,
  distanceBetween2Vector,
  vectorOnCircleLine,
  vectorOnDiagonalLine,
} from "@/utils";
import {
  BTN_OPTION_ICON_SIZE,
  BTN_OPTION_SIZE,
  MAX_SCALE,
  MIN_SCALE,
} from "@/constants/EditImage";

const ResizeComponent: React.FC<{ component: Component }> = ({ component }) => {
  const R = React.useMemo(
    () => component.size.width / 2 + BTN_OPTION_SIZE / 2,
    [component]
  );
  const translate = usePositionXY({ x: R, y: -R / 2 });
  const prevTranslate = usePositionXY({ x: 0, y: 0 });
  const prevScale = useSharedValue(component.scale.value);
  const position: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: GESTURE_Z_INDEX + 2,
  };
  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = translate.x.value;
      prevTranslate.y.value = translate.y.value;
      prevScale.value = component.scale.value;
    })
    .onUpdate((event) => {
      //TODO:
      const translateX = prevTranslate.x.value + event.translationX;
      const translateY = prevTranslate.y.value + event.translationY;
      const rePositionXY = vectorOnDiagonalLine(
        { x: translateX, y: translateY },
        component.size.width,
        component.size.height
      );
      console.log(translateX, translateY, prevTranslate.x.value, prevTranslate.y.value);
      //END TODO:
      //clamp(prevScale.value * event.scale, 0.5, 3.0);
      const distance = distanceBetween2Vector(
        { x: rePositionXY.x, y: rePositionXY.y },
        { x: prevTranslate.x.value, y: prevTranslate.y.value }
      );
      const positionXYDistance = distanceBetween2Vector(
        { x: rePositionXY.x, y: rePositionXY.y },
        { x: 0, y: 0 }
      );
      const translateDistance = distanceBetween2Vector(
        { x: 0, y: 0 },
        { x: prevTranslate.x.value, y: prevTranslate.y.value }
      );
      const distancePercent =
        (distance / component.size.width + distance / component.size.height) /
        2;
      const scaling =
        prevScale.value -
        (positionXYDistance < translateDistance ? 1 : -1) * distancePercent;
      if (scaling >= MIN_SCALE || scaling <= MAX_SCALE) {
        component.scale.value = clamp(
          prevScale.value -
            (positionXYDistance < translateDistance ? 1 : -1) * distancePercent,
          MIN_SCALE,
          MAX_SCALE
        );
        translate.x.value = prevTranslate.x.value + event.translationX;
        translate.y.value = prevTranslate.y.value + event.translationY;
      }
    })
    .runOnJS(true);

  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translate.x.value,
        },
        {
          translateY: translate.y.value,
        },
      ] as never,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[position]}>
        <Box className="bg-white/54 rounded-full" style={styles.icons}>
          <Ionicons name="resize" size={BTN_OPTION_ICON_SIZE} color="black" />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

const TrashComponent: React.FC<{ component: Component }> = ({ component }) => {
  const queryClient = useQueryClient();
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
    top: component.size.height / 2 - BTN_OPTION_SIZE / 2,
    left: component.size.width / 2 - BTN_OPTION_SIZE / 2,
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

const RotateGestureComponent: React.FC<{
  component: Component;
  step: number;
}> = ({ component, step }) => {
  const initRotation = React.useMemo(() => component.rotate.value, []);
  const R = useDerivedValue(
    () => componentSize(component).width / 2 + BTN_OPTION_SIZE / 2
  );
  const translate = usePositionXY({ x: R.value, y: 0 });
  const prevTranslate = usePositionXY({ x: 0, y: 0 });
  const positionXY = useDerivedValue(() => {
    return vectorOnCircleLine(
      { x: translate.x.value, y: translate.y.value },
      R.value
    );
  });

  const position: ViewStyle = {
    position: "absolute",
    top: component.size.height / 2 - BTN_OPTION_SIZE / 2,
    left: component.size.width / 2 - BTN_OPTION_SIZE / 2,
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
  const pan = Gesture.Pan()
    .onBegin(() => {
      prevTranslate.x.value = translate.x.value;
      prevTranslate.y.value = translate.y.value;
    })
    .onUpdate((event) => {
      translate.x.value = prevTranslate.x.value + event.translationX;
      translate.y.value = prevTranslate.y.value + event.translationY;
      const rad = Math.atan2(translate.y.value, translate.x.value);
      component.rotate.value = initRotation + rad;
    })
    .runOnJS(true);
  const race = Gesture.Simultaneous(tap, pan);
  const transformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: positionXY.value.x,
        },
        {
          translateY: positionXY.value.y,
        },
      ] as never,
    };
  });
  return (
    <GestureDetector gesture={race}>
      <Animated.View style={[position, transformStyle]}>
        <Box className="bg-white/54 rounded-full" style={styles.icons}>
          <Feather name="rotate-cw" size={BTN_OPTION_ICON_SIZE} color="black" />
        </Box>
      </Animated.View>
    </GestureDetector>
  );
};

const GestureComponent: React.FC<{ component: Component; index: number }> = ({
  component,
  index,
}) => {
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

  const size: ViewStyle = React.useMemo(
    () => ({
      width: component.size?.width || 1,
      height: component.size?.height || 1,
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
      {
        scale: component.scale.value,
      },
    ] as never,
  }));

  return (
    <Animated.View style={[size, translateStyle]}>
      <GestureDetector gesture={race}>
        <Animated.View style={[size, contentStyle]}>
          <Box className="flex-1 border-dotted border border-secondary-900" />
        </Animated.View>
      </GestureDetector>
      <RotateGestureComponent step={0.1} component={component} />
      <TrashComponent component={component} />
      <ResizeComponent component={component} />
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
