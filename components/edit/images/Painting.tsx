import { Component, FitSize, MatrixIndex, PaintMatrix } from "@/type/store";
import { rootTranslate } from "@/utils";
import {
  BlendMode,
  Group,
  Picture,
  Skia,
  Transforms3d,
  createPicture,
} from "@shopify/react-native-skia";
import React from "react";
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
  const picture = createPicture((canvas) => {
    const listPath = component.data as PaintMatrix;
    const paint = Skia.Paint();
    paint.setBlendMode(BlendMode.Multiply);
    paint.setColor(Skia.Color("#000000"));
    paint.setAlphaf(opacity);
    const path = Skia.Path.Make();
    listPath.forEach((line) => {
      for (let i = 0; i < line.length - 2; i += 2) {
        const x = line[i] * rootSize.scale.value;
        const y = line[i + 1] * rootSize.scale.value;
        if (i === 0) {
          path.moveTo(x, y);
          continue;
        }
        path.lineTo(x, y);
      }
    });
    path.stroke({ width: 2 });
    path.close();
    canvas.drawPath(path, paint);
  });
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
