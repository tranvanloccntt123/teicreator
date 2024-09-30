import React from "react";
import {
  Component,
  FitSize,
  MatrixIndex,
  PaintMatrix,
  PaintType,
} from "@/type/store";
import { rootTranslate } from "@/utils";
import {
  BlendMode,
  Group,
  Picture,
  Skia,
  StrokeCap,
  StrokeJoin,
  Transforms3d,
  createPicture,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";
import {
  PAINT_BLEND_MODE,
  PAINT_COLOR_POSITION,
  PAINT_PEN_TYPE,
  PAINT_START_POSITION,
  PAINT_STROKE_CAP,
  PAINT_STROKE_JOIN,
  PAINT_WEIGHT_POSITION,
} from "@/constants/Workspace";

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
    listPath.forEach((line) => {
      const color = line[PAINT_COLOR_POSITION] as string;
      const weight = line[PAINT_WEIGHT_POSITION] as number;
      const paintType = line[PAINT_PEN_TYPE] as PaintType;
      paint.setBlendMode(PAINT_BLEND_MODE[paintType]);
      const path = Skia.Path.Make();
      paint.setColor(Skia.Color(color));
      paint.setAlphaf(opacity);
      if (line.length === PAINT_START_POSITION + 2) {
        const x = (line[PAINT_START_POSITION] as number) * rootSize.scale.value;
        const y =
          (line[PAINT_START_POSITION + 1] as number) * rootSize.scale.value;
        path.addCircle(x, y, (weight / 1.8) * rootSize.scale.value);
      } else {
        for (let i = PAINT_START_POSITION; i < line.length - 2; i += 2) {
          const x = (line[i] as number) * rootSize.scale.value;
          const y = (line[i + 1] as number) * rootSize.scale.value;
          if (i === PAINT_START_POSITION) {
            path.moveTo(x, y);
            continue;
          }
          path.lineTo(x, y);
        }
        path.stroke({
          width: weight * rootSize.scale.value,
          cap: PAINT_STROKE_CAP[paintType],
          join: PAINT_STROKE_JOIN[paintType],
        });
      }

      path.close();
      canvas.drawPath(path, paint);
    });
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
