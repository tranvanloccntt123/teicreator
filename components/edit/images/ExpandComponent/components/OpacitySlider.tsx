import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { MAX_OPACITY, MIN_OPACITY, OPACITY_STEP } from "@/constants/Workspace";
import { Component, MatrixIndex } from "@/type/store";
import { verticalScale } from "react-native-size-matters";
import { Slider } from "@miblanchard/react-native-slider";
import { getComponentTransform, updateComponentTransform } from "@/utils";
import ExpandItemContainer from "./ExpandItemContainer";

const OpacitySlider: React.FC<{ component?: Component }> = ({ component }) => {
  const [opacity, setOpacity] = React.useState<number>(0);
  React.useEffect(() => {
    setOpacity(
      component
        ? getComponentTransform(component, MatrixIndex.OPACITY) * MAX_OPACITY
        : 0
    );
  }, [component]);
  return (
    <ExpandItemContainer>
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
    </ExpandItemContainer>
  );
};

export default OpacitySlider;
