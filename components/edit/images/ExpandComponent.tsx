import React from "react";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import {
  BLUR_STEP,
  TOOL_COMPONENT_Z_INDEX,
  TEMPERATURE_UP_STEP,
  MAX_BLUR,
  MAX_TEMPERATURE_UP,
  MIN_BLUR,
  MIN_TEMPERATURE_UP,
  MIN_OPACITY,
  MAX_OPACITY,
  OPACITY_STEP,
  EXPAND_COMPONENT_Z_INDEX,
  INIT_MATRIX,
  PAINT_WEIGHT,
} from "@/constants/Workspace";
import Animated, {
  interpolate,
  makeMutable,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";
import useCurrentWorkspace, {
  clearCurrentComponent,
  pushComponentToCurrentWorkspace,
  updatePaintParams,
} from "@/hooks/useWorkspace";
import { Slider } from "@miblanchard/react-native-slider";
import {
  findCurrentComponent,
  first,
  getComponentTransform,
  last,
  updateComponentTransform,
} from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Center } from "@/components/ui/center";
import { Component, MatrixIndex, PaintMatrix } from "@/type/store";
import { Button, ButtonGroup } from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import FrameList from "./FrameList";
import uuid from "react-native-uuid";
import { Pressable } from "react-native";

const ExpandComponent = () => {
  const queryClient = useQueryClient();

  const { data: workspace } = useCurrentWorkspace();

  const component = React.useMemo(
    () =>
      findCurrentComponent(
        workspace?.components || [],
        workspace?.componentEditingId
      ),
    [workspace, workspace?.componentEditingId, workspace?.components]
  );

  const [blur, setBlur] = React.useState<number>(0);

  const [temperature, setTemperature] = React.useState<number>(0);

  const [opacity, setOpacity] = React.useState<number>(0);

  const [paintWeight, setPaintWeight] = React.useState<number>(PAINT_WEIGHT[0]);

  const [isBlurVisible, setIsBlurVisible] = React.useState<boolean>(false);

  const [isTemperatureVisible, setIsTemperatureVisible] =
    React.useState<boolean>(false);

  const [isOpacityVisible, setIsOpacityVisible] =
    React.useState<boolean>(false);

  const [isFrameVisible, setIsFrameVisible] = React.useState<boolean>(false);

  const [isPntLineWeightVisible, setIsPntLineWeightVisible] =
    React.useState<boolean>(false);

  const isComponentExpand = useSharedValue(0);

  React.useEffect(() => {
    isComponentExpand.value = withTiming(
      Boolean(workspace?.componentEditingId) ? 1 : 0,
      {
        duration: 200,
      }
    );
  }, [workspace?.componentEditingId]);

  React.useEffect(() => {
    if (component) {
      setBlur(getComponentTransform(component, MatrixIndex.BLUR));
      setTemperature(
        getComponentTransform(component, MatrixIndex.TEMPERATURE_UP)
      );
      setOpacity(getComponentTransform(component, MatrixIndex.OPACITY) * 100);
      setPaintWeight(component.params?.lastWeight ?? PAINT_WEIGHT[0]);
    } else {
      setBlur(0);
      setTemperature(0);
      setOpacity(0);
      setPaintWeight(PAINT_WEIGHT[0]);
    }
  }, [component]);

  const closeExpand = () => {
    setIsBlurVisible(false);
    setIsTemperatureVisible(false);
    setIsOpacityVisible(false);
    setIsPntLineWeightVisible(false);
  };

  const closeTool = () => {
    setIsFrameVisible(false);
  };

  useAnimatedReaction(
    () => isComponentExpand.value,
    (res) => {
      if (!res) {
        runOnJS(closeExpand)();
      } else {
        runOnJS(closeTool)();
      }
    },
    [isComponentExpand.value]
  );

  const componentExpandStyle = useAnimatedStyle(() => ({
    opacity: isComponentExpand.value,
    zIndex: interpolate(
      isComponentExpand.value,
      [0, 1],
      [-1, EXPAND_COMPONENT_Z_INDEX]
    ),
  }));

  const componentToolStyle = useAnimatedStyle(() => ({
    opacity: interpolate(isComponentExpand.value, [0, 1], [1, 0]),
    zIndex: interpolate(
      isComponentExpand.value,
      [0, 1],
      [EXPAND_COMPONENT_Z_INDEX, -1]
    ),
  }));

  const createPaint = () => {
    const componentId: string = uuid.v4() as string;
    const newComponent: Component = {
      id: componentId,
      data: [],
      size: workspace.size,
      isBase64: true,
      matrix: INIT_MATRIX.map((v) => makeMutable(v)),
      type: "PAINT",
      params: {
        lastWeight: PAINT_WEIGHT[0],
      },
    };
    pushComponentToCurrentWorkspace(newComponent, queryClient);
  };

  return (
    <>
      {isFrameVisible && <FrameList />}
      <Animated.View style={styles.container}>
        <Center className="flex-1">
          {isBlurVisible && (
            <Box
              style={styles.toolContainer}
              className="bg-white rounded-xl shadow-md px-4 py-2"
            >
              <Box style={{ width: "100%" }}>
                <Text>Làm mờ</Text>
                <Slider
                  value={blur}
                  onValueChange={(value) => {
                    setBlur(value[0]);
                    updateComponentTransform(
                      component,
                      MatrixIndex.BLUR,
                      value[0]
                    );
                  }}
                  minimumValue={MIN_BLUR}
                  maximumValue={MAX_BLUR}
                  containerStyle={{ width: "100%", height: verticalScale(35) }}
                  step={BLUR_STEP}
                  minimumTrackTintColor="#7ccff8"
                  maximumTrackTintColor="#d4d4d4"
                />
              </Box>
            </Box>
          )}
          {isTemperatureVisible && component?.type === "IMAGE" && (
            <Box
              style={styles.toolContainer}
              className="bg-white rounded-xl shadow-md px-4 py-2"
            >
              <Box style={{ width: "100%" }}>
                <Text>Tăng nhiệt độ</Text>
                <Slider
                  value={temperature}
                  onValueChange={(value) => {
                    setTemperature(value[0]);
                    updateComponentTransform(
                      component,
                      MatrixIndex.TEMPERATURE_UP,
                      value[0]
                    );
                  }}
                  minimumValue={MIN_TEMPERATURE_UP}
                  maximumValue={MAX_TEMPERATURE_UP}
                  containerStyle={{ width: "100%", height: verticalScale(35) }}
                  step={TEMPERATURE_UP_STEP}
                  minimumTrackTintColor="#7ccff8"
                  maximumTrackTintColor="#d4d4d4"
                />
              </Box>
            </Box>
          )}
          {isOpacityVisible && (
            <Box
              style={styles.toolContainer}
              className="bg-white rounded-xl shadow-md px-4 py-2"
            >
              <Box style={{ width: "100%" }}>
                <Text>Trong suốt</Text>
                <Slider
                  value={opacity}
                  onValueChange={(value) => {
                    setOpacity(value[0]);
                    updateComponentTransform(
                      component,
                      MatrixIndex.OPACITY,
                      value[0] / MAX_OPACITY
                    );
                  }}
                  minimumValue={MIN_OPACITY}
                  maximumValue={MAX_OPACITY}
                  containerStyle={{ width: "100%", height: verticalScale(35) }}
                  step={OPACITY_STEP}
                  minimumTrackTintColor="#7ccff8"
                  maximumTrackTintColor="#d4d4d4"
                />
              </Box>
            </Box>
          )}
          {isPntLineWeightVisible && (
            <Box
              style={{
                ...(styles.toolContainer as any),
                top: -PAINT_WEIGHT.length * 32,
              }}
              className="bg-white rounded-xl shadow-md px-4 py-2"
            >
              <Box style={{ width: "100%" }}>
                <Text>Kích cỡ</Text>
                {PAINT_WEIGHT.map((weight) => {
                  return (
                    <Box
                      key={`weight-${weight}`}
                      style={{ width: "100%", height: 20 }}
                      className={`mb-1 ${paintWeight === weight ? "bg-secondary-50" : "bg-white"} px-2`}
                    >
                      <Pressable
                        onPress={() => {
                          setPaintWeight(weight);
                          updatePaintParams(queryClient, {
                            lastWeight: weight,
                          });
                        }}
                        style={{ flex: 1 }}
                      >
                        <Center className="flex-1">
                          <Box
                            style={{
                              width: "100%",
                              height: weight,
                            }}
                            className="bg-primary-500 rounded-md"
                          />
                        </Center>
                      </Pressable>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          <Animated.View style={[componentExpandStyle, styles.expandContainer]}>
            <Box className="bg-white flex-1 rounded-md p-2 shadow-md">
              <ButtonGroup flexDirection="row" className="flex-row px-2">
                {component?.type === "PAINT" && (
                  <Button
                    variant="outline"
                    className="border-0"
                    onPress={() => {
                      const preValue = isPntLineWeightVisible;
                      closeExpand();
                      setIsPntLineWeightVisible(!preValue);
                    }}
                  >
                    <MaterialIcons name="line-weight" size={24} color="black" />
                  </Button>
                )}
                {component?.type === "IMAGE" && (
                  <Button
                    variant="outline"
                    className="border-0"
                    onPress={() => {
                      const preValue = isBlurVisible;
                      closeExpand();
                      setIsBlurVisible(!preValue);
                    }}
                  >
                    <MaterialIcons name="blur-on" size={24} color="black" />
                  </Button>
                )}
                {component?.type === "IMAGE" && (
                  <Button
                    variant="outline"
                    onPress={() => {
                      const preValue = isTemperatureVisible;
                      closeExpand();
                      setIsTemperatureVisible(!preValue);
                    }}
                    className="border-0"
                  >
                    <Fontisto name="day-sunny" size={24} color="black" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onPress={() => {
                    const preValue = isOpacityVisible;
                    closeExpand();
                    setIsOpacityVisible(!preValue);
                  }}
                  className="border-0"
                >
                  <MaterialCommunityIcons
                    name="circle-opacity"
                    size={24}
                    color="black"
                  />
                </Button>
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={() => {
                    closeExpand();
                    clearCurrentComponent(queryClient);
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </Button>
              </ButtonGroup>
            </Box>
          </Animated.View>
          <Animated.View
            style={[
              styles.expandContainer,
              { zIndex: EXPAND_COMPONENT_Z_INDEX },
              componentToolStyle,
            ]}
          >
            <Box className="bg-white flex-1 rounded-md p-2 shadow-md">
              <ButtonGroup flexDirection="row" className="flex-row px-2">
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={createPaint}
                >
                  <FontAwesome6 name="paintbrush" size={24} color="black" />
                </Button>
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={() => {
                    const preValue = isFrameVisible;
                    closeTool();
                    setIsFrameVisible(!preValue);
                  }}
                >
                  <MaterialCommunityIcons
                    name="image-frame"
                    size={24}
                    color="black"
                  />
                </Button>
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={() => router.navigate("/upload-image")}
                >
                  <AntDesign name="plus" size={24} color="black" />
                </Button>
              </ButtonGroup>
            </Box>
          </Animated.View>
        </Center>
      </Animated.View>
    </>
  );
};

export default ExpandComponent;

const styles = ScaledSheet.create({
  container: {
    position: "absolute",
    zIndex: TOOL_COMPONENT_Z_INDEX,
    bottom: "25@s",
    left: "50@s",
    right: "50@s",
  },
  toolContainer: {
    position: "absolute",
    width: "120@s",
    top: "-65@vs",
  },
  expandContainer: {
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
});
