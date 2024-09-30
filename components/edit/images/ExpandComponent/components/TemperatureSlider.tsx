import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  MAX_TEMPERATURE_UP,
  MIN_TEMPERATURE_UP,
  TEMPERATURE_UP_STEP,
} from "@/constants/Workspace";
import { Component, MatrixIndex } from "@/type/store";
import { verticalScale } from "react-native-size-matters";
import { Slider } from "@miblanchard/react-native-slider";
import { getComponentTransform, updateComponentTransform } from "@/utils";
import ExpandItemContainer from "./ExpandItemContainer";
const TemperatureSlider: React.FC<{ component?: Component }> = ({
  component,
}) => {
  const [temperature, setTemperature] = React.useState<number>(0);
  React.useEffect(() => {
    setTemperature(
      component
        ? getComponentTransform(component, MatrixIndex.TEMPERATURE_UP)
        : 0
    );
  }, [component]);
  return (
    <ExpandItemContainer>
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
    </ExpandItemContainer>
  );
};

export default TemperatureSlider;
