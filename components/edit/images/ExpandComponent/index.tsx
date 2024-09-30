import React from "react";
import { Box } from "@/components/ui/box";
import {
  TOOL_COMPONENT_Z_INDEX,
  EXPAND_COMPONENT_Z_INDEX,
  INIT_MATRIX,
  PAINT_WEIGHT,
  COLOR,
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
import { ScaledSheet } from "react-native-size-matters";
import useCurrentWorkspace, {
  clearCurrentComponent,
  pushComponentToCurrentWorkspace,
} from "@/hooks/useWorkspace";
import { findCurrentComponent } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Center } from "@/components/ui/center";
import { Component, PaintType } from "@/type/store";
import { Button, ButtonGroup } from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import FrameList from "../FrameList";
import uuid from "react-native-uuid";
import BlurSlider from "./components/BlurSlider";
import TemperatureSlider from "./components/TemperatureSlider";
import OpacitySlider from "./components/OpacitySlider";
import PaintLineWeightSlider from "./components/PaintLineWeightSlider";
import PaintColor from "./components/PaintColor";
import PenIcon from "./components/PenIcon";
import PenList from "./components/PenList";
import useColorSchemeStyle from "@/hooks/useColorSchemeStyles";

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

  const colorSchemeStyle = useColorSchemeStyle();

  const [isBlurVisible, setIsBlurVisible] = React.useState<boolean>(false);

  const [isTemperatureVisible, setIsTemperatureVisible] =
    React.useState<boolean>(false);

  const [isOpacityVisible, setIsOpacityVisible] =
    React.useState<boolean>(false);

  const [isFrameVisible, setIsFrameVisible] = React.useState<boolean>(false);

  const [isPntLineWeightVisible, setIsPntLineWeightVisible] =
    React.useState<boolean>(false);

  const [isPntColorVisible, setIsPntColorVisible] =
    React.useState<boolean>(false);

  const [isPntTypeVisible, setIsPntTypeVisible] =
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

  const closeExpand = () => {
    setIsBlurVisible(false);
    setIsTemperatureVisible(false);
    setIsOpacityVisible(false);
    setIsPntLineWeightVisible(false);
    setIsPntColorVisible(false);
    setIsPntTypeVisible(false);
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
        lastColor: COLOR[0][1],
        lastPainType: PaintType.PEN,
      },
    };
    pushComponentToCurrentWorkspace(newComponent, queryClient);
  };

  return (
    <>
      {isFrameVisible && <FrameList />}
      <Animated.View style={styles.container}>
        <Center className="flex-1">
          {isBlurVisible && <BlurSlider component={component} />}
          {isTemperatureVisible && component?.type === "IMAGE" && (
            <TemperatureSlider component={component} />
          )}
          {isOpacityVisible && <OpacitySlider component={component} />}
          {isPntLineWeightVisible && (
            <PaintLineWeightSlider component={component} />
          )}
          {isPntTypeVisible && <PenList component={component} />}
          {isPntColorVisible && <PaintColor component={component} />}
          <Animated.View style={[componentExpandStyle, styles.expandContainer]}>
            <Box
              style={colorSchemeStyle.box}
              className="flex-1 rounded-md p-2 shadow-md"
            >
              <ButtonGroup flexDirection="row" className="flex-row px-2">
                {component?.type === "PAINT" && (
                  <Button
                    variant="outline"
                    className="border-0"
                    onPress={() => {
                      const preValue = isPntTypeVisible;
                      closeExpand();
                      setIsPntTypeVisible(!preValue);
                    }}
                  >
                    <PenIcon
                      type={component?.params?.lastPainType}
                      {...colorSchemeStyle.icon}
                    />
                  </Button>
                )}
                {component?.type === "PAINT" && (
                  <Button
                    variant="outline"
                    className="border-0"
                    onPress={() => {
                      const preValue = isPntColorVisible;
                      closeExpand();
                      setIsPntColorVisible(!preValue);
                    }}
                  >
                    <Ionicons
                      name="color-palette-outline"
                      size={24}
                      {...colorSchemeStyle.icon}
                    />
                  </Button>
                )}
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
                    <MaterialIcons
                      name="line-weight"
                      size={24}
                      {...colorSchemeStyle.icon}
                    />
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
                    <MaterialIcons
                      name="blur-on"
                      size={24}
                      {...colorSchemeStyle.icon}
                    />
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
                    <Fontisto
                      name="day-sunny"
                      size={24}
                      {...colorSchemeStyle.icon}
                    />
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
                    {...colorSchemeStyle.icon}
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
                  <AntDesign
                    name="close"
                    size={24}
                    {...colorSchemeStyle.icon}
                  />
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
            <Box
              style={colorSchemeStyle.box}
              className="flex-1 rounded-md p-2 shadow-md"
            >
              <ButtonGroup flexDirection="row" className="flex-row px-2">
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={createPaint}
                >
                  <FontAwesome6
                    name="paintbrush"
                    size={24}
                    {...colorSchemeStyle.icon}
                  />
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
                    {...colorSchemeStyle.icon}
                  />
                </Button>
                <Button
                  variant="outline"
                  className="border-0"
                  onPress={() => router.navigate("/upload-image")}
                >
                  <AntDesign name="plus" size={24} {...colorSchemeStyle.icon} />
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
    bottom: "40@s",
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
