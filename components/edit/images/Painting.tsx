import { Component, FitSize, PaintMatrix } from "@/type/store";
import {
  BlendMode,
  Group,
  Picture,
  Skia,
  createPicture,
} from "@shopify/react-native-skia";
import React from "react";
import { SharedValue } from "react-native-reanimated";

const Painting: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const picture = createPicture((canvas) => {
    const listPath = component.data as PaintMatrix;
    const paint = Skia.Paint();
    paint.setBlendMode(BlendMode.Multiply);
    paint.setColor(Skia.Color("#000000"));
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
  return (
    <Group>
      <Picture picture={picture} />
    </Group>
  );
};

export default Painting;
