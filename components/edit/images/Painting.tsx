import React from "react";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import { paintLinePath, rootTranslate } from "@/utils";
import {
  Group,
  Picture,
  Transforms3d,
  createPicture,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";

const Painting: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const [opacity, setOpacity] = React.useState(1);
  useDerivedValue(() => {
    runOnJS(setOpacity)(component.matrix[MatrixIndex.OPACITY].value);
  });
  const picture = createPicture((canvas) =>
    paintLinePath(component, canvas, { scale: rootSize.scale.value, opacity })
  );
  const translateTransform = useDerivedValue(
    (): Transforms3d => [
      {
        translateX: rootTranslate({
          width,
          height,
          viewHeight: rootSize.height.value,
          viewWidth: rootSize.width.value,
        }).x,
      },
      {
        translateY: rootTranslate({
          width,
          height,
          viewHeight: rootSize.height.value,
          viewWidth: rootSize.width.value,
        }).y,
      },
    ]
  );

  return (
    <Group transform={translateTransform}>
      <Picture picture={picture} />
    </Group>
  );
};

export default Painting;
