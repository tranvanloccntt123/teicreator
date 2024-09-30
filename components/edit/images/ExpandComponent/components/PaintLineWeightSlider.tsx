import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  MAX_PAINT_WEIGHT,
  MIN_PAINT_WEIGHT,
  PAINT_WEIGHT,
  PAINT_WEIGHT_STEP,
} from "@/constants/Workspace";
import { Component } from "@/type/store";
import { verticalScale } from "react-native-size-matters";
import { Slider } from "@miblanchard/react-native-slider";
import { updatePaintParams } from "@/hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import ExpandItemContainer from "./ExpandItemContainer";

const PaintLineWeightSlider: React.FC<{ component?: Component }> = ({
  component,
}) => {
  const queryClient = useQueryClient();
  const [paintWeight, setPaintWeight] = React.useState<number>(PAINT_WEIGHT[0]);
  React.useEffect(() => {
    setPaintWeight(component ? component.params.lastWeight : PAINT_WEIGHT[0]);
  }, [component]);
  return (
    <ExpandItemContainer>
      <Box style={{ width: "100%" }}>
        <Text>Kích cỡ</Text>
        <Slider
          value={paintWeight}
          onValueChange={(value) => {
            setPaintWeight(value[0]);
            updatePaintParams(queryClient, {
              lastWeight: value[0],
            });
          }}
          minimumValue={MIN_PAINT_WEIGHT}
          maximumValue={MAX_PAINT_WEIGHT}
          containerStyle={{ width: "100%", height: verticalScale(35) }}
          step={PAINT_WEIGHT_STEP}
          minimumTrackTintColor="#7ccff8"
          maximumTrackTintColor="#d4d4d4"
        />
      </Box>
    </ExpandItemContainer>
  );
};

export default PaintLineWeightSlider;
