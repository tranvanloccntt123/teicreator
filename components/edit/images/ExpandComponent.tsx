import React from "react";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import {
  BLUR_STEP,
  EXPAND_CLOSE_POSITION,
  EXPAND_COMPONENT_Z_INDEX,
  EXPAND_OPEN_POSITION,
  LIGHT_UP_STEP,
  MAX_BLUR,
  MAX_LIGHT_UP,
  MIN_BLUR,
  MIN_LIGHT_UP,
} from "@/constants/Workspace";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScaledSheet, verticalScale } from "react-native-size-matters";
import useCurrentWorkspace, {
  clearCurrentComponent,
  updateCurrentWorkspace,
} from "@/hooks/useWorkspace";
import { Slider } from "@miblanchard/react-native-slider";
import { findCurrentComponent } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Center } from "@/components/ui/center";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

const ExpandComponent = () => {
  const queryClient = useQueryClient();

  const { data: workspace } = useCurrentWorkspace();

  const currentComponent = React.useMemo(
    () =>
      findCurrentComponent(
        workspace?.components || [],
        workspace?.componentEditingId
      ),
    [workspace?.componentEditingId, workspace?.components]
  );

  const [blur, setBlur] = React.useState<number>(0);

  const [temperature, setTemperature] = React.useState<number>(0);

  const [isBlurVisible, setIsBlurVisible] = React.useState<boolean>(false);

  const [isTemperatureVisible, setIsTemperatureVisible] =
    React.useState<boolean>(false);

  const isOpen = useSharedValue(0);

  React.useEffect(() => {
    isOpen.value = withTiming(Boolean(workspace?.componentEditingId) ? 1 : 0, {
      duration: 200,
    });
  }, [workspace?.componentEditingId]);

  React.useEffect(() => {
    if (currentComponent) {
      setBlur(currentComponent.blur.value);
      setTemperature(currentComponent.lightUpPercent.value);
    } else {
      setBlur(0);
      setTemperature(0);
    }
  }, [currentComponent]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      zIndex: interpolate(isOpen.value, [0, 1], [0, EXPAND_COMPONENT_Z_INDEX]),
      opacity: isOpen.value,
    };
  });

  const closeExpand = () => {
    setIsBlurVisible(false);
    setIsTemperatureVisible(false);
  };

  useAnimatedReaction(
    () => isOpen.value,
    (res) => {
      if (!res) {
        runOnJS(closeExpand)();
      }
    },
    [isOpen.value]
  );

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Center className="flex-1">
        {isBlurVisible && (
          <Box
            style={styles.expandContainer}
            className="bg-white rounded-xl shadow-md px-4 py-2"
          >
            <Box style={{ width: "100%" }}>
              <Text>Làm mờ</Text>
              <Slider
                value={blur}
                onValueChange={(value) => {
                  setBlur(value[0]);
                  updateCurrentWorkspace(
                    workspace?.componentEditingId,
                    {
                      blur: value[0],
                    },
                    queryClient
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
        {isTemperatureVisible && (
          <Box
            style={styles.expandContainer}
            className="bg-white rounded-xl shadow-md px-4 py-2"
          >
            <Box style={{ width: "100%" }}>
              <Text>Tăng nhiệt độ</Text>
              <Slider
                value={temperature}
                onValueChange={(value) => {
                  setTemperature(value[0]);
                  updateCurrentWorkspace(
                    workspace?.componentEditingId,
                    {
                      lightUpPercent: value[0],
                    },
                    queryClient
                  );
                }}
                minimumValue={MIN_LIGHT_UP}
                maximumValue={MAX_LIGHT_UP}
                containerStyle={{ width: "100%", height: verticalScale(35) }}
                step={LIGHT_UP_STEP}
                minimumTrackTintColor="#7ccff8"
                maximumTrackTintColor="#d4d4d4"
              />
            </Box>
          </Box>
        )}
        <Box className="bg-white flex-1 rounded-md p-2 shadow-md">
          <ButtonGroup flexDirection="row" className="flex-row px-2">
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
            <Button
              variant="outline"
              onPress={() => {
                const preValue = isTemperatureVisible;
                closeExpand();
                setIsTemperatureVisible(!preValue);
              }}
              className="border-0"
            >
              <ButtonText>Tăng nhiệt độ</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="border-0"
              onPress={() => {
                clearCurrentComponent(queryClient);
              }}
            >
              <AntDesign name="close" size={24} color="black" />
            </Button>
          </ButtonGroup>
        </Box>
      </Center>
    </Animated.View>
  );
};

export default ExpandComponent;

const styles = ScaledSheet.create({
  container: {
    position: "absolute",
    zIndex: -1,
    bottom: "5@s",
    left: "50@s",
    right: "50@s",
  },
  expandContainer: {
    position: "absolute",
    width: "120@s",
    top: "-65@vs",
  },
});
