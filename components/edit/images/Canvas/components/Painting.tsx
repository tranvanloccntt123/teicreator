import React from "react";
import { EditComponent, FitSize, MatrixIndex } from "@/type/store";
import { paintLinePath, rootTranslate } from "@/utils";
import {
  Group,
  Path,
  Picture,
  Transforms3d,
  createPicture,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { SharedValue, runOnJS, useDerivedValue } from "react-native-reanimated";

const Painting: React.FC<{
  component: EditComponent;
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
      {/* <Path
        path={`M 10 150 
    Q 20 150, 30 150
    Q 40 200, 50 150
    Q 60 100, 70 150
    Q 80 200, 90 150
    Q 100 100, 110 150
    Q 120 200, 130 150
    Q 140 100, 150 150
    Q 160 200, 170 150
    Q 180 100, 190 150
    Q 200 200, 210 150
    Q 220 100, 230 150
    Q 240 200, 250 150
    Q 260 100, 270 150
    Q 280 200, 290 150
    Q 300 100, 310 150
    Q 320 200, 330 150
    Q 340 100, 350 150
    Q 360 200, 370 150
    Q 380 100, 390 150
    Q 400 200, 410 150
    Q 420 100, 430 150
    Q 440 200, 450 150
    Q 460 100, 470 150
    Q 480 200, 490 150
    Q 500 100, 510 150
    Q 520 200, 530 150
    Q 540 100, 550 150
    Q 560 200, 570 150
    Q 580 100, 590 150`}
        stroke={{ width: 5 }}
      /> */}
    </Group>
  );
};

export default Painting;
