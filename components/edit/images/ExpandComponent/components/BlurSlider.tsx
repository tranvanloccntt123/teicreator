import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { BLUR_STEP, MAX_BLUR, MIN_BLUR } from "@/constants/Workspace";
import { Component, MatrixIndex } from "@/type/store";
import { verticalScale } from "react-native-size-matters";
import { Slider } from "@miblanchard/react-native-slider";
import { getComponentTransform, updateComponentTransform } from "@/utils";
import ExpandItemContainer from "./ExpandItemContainer";

const BlurSlider: React.FC<{ component?: Component }> = ({ component }) => {
  const [blur, setBlur] = React.useState<number>(0);
  React.useEffect(() => {
    setBlur(component ? getComponentTransform(component, MatrixIndex.BLUR) : 0);
  }, [component]);
  return (
    <ExpandItemContainer>
      <Box style={{ width: "100%" }}>
        <Text>Làm mờ</Text>
        <Slider
          value={blur}
          onValueChange={(value) => {
            setBlur(value[0]);
            updateComponentTransform(component, MatrixIndex.BLUR, value[0]);
          }}
          minimumValue={MIN_BLUR}
          maximumValue={MAX_BLUR}
          containerStyle={{ width: "100%", height: verticalScale(35) }}
          step={BLUR_STEP}
          minimumTrackTintColor="#7ccff8"
          maximumTrackTintColor="#d4d4d4"
        />
      </Box>
    </ExpandItemContainer>
  );
};

export default BlurSlider;
