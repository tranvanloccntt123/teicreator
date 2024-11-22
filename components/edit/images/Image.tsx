import React from "react";
import {
  Group,
  Image as CanvasImage,
  Transforms3d,
  Blur,
  ColorMatrix,
  SkImage,
} from "@shopify/react-native-skia";
import { ImageComponent, FitSize, MatrixIndex } from "@/type/store";
import { useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  getComponentTransform,
  temperatureUp,
  resizeComponentFitWorkspace,
  rootTranslate,
} from "@/utils";
import { MATRIX_FILTER } from "@/constants/Workspace";

const Image: React.FC<{
  component: ImageComponent;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const size = useDerivedValue(() =>
    resizeComponentFitWorkspace(component, rootSize.scale)
  );
  console.log(size.value, component.size, rootSize.width.value, rootSize.height.value, rootSize.scale.value);
  const contentTransform = useDerivedValue(
    (): Transforms3d => [
      { rotate: getComponentTransform(component, MatrixIndex.ROTATE) },
      { scale: getComponentTransform(component, MatrixIndex.SCALE) },
    ]
  );
  const translateTransform = useDerivedValue(
    (): Transforms3d => [
      {
        translateX:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).x +
          getComponentTransform(
            component,
            MatrixIndex.TRANSLATE_X,
            rootSize.scale.value
          ),
      },
      {
        translateY:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).y +
          getComponentTransform(
            component,
            MatrixIndex.TRANSLATE_Y,
            rootSize.scale.value
          ),
      },
    ]
  );

  const blur = useDerivedValue(() =>
    getComponentTransform(component, MatrixIndex.BLUR)
  );

  const colorMatrix = useDerivedValue(() =>
    temperatureUp(
      MATRIX_FILTER,
      getComponentTransform(component, MatrixIndex.TEMPERATURE_UP)
    )
  );

  const opacity = useDerivedValue(() =>
    getComponentTransform(component, MatrixIndex.OPACITY)
  );

  const imageWidth = useDerivedValue(() => size.value.width);

  const imageHeight = useDerivedValue(() => size.value.height);

  const origin = useDerivedValue(() => ({
    x: size.value.width / 2,
    y: size.value.height / 2,
  }));

  return (
    <Group transform={translateTransform} opacity={opacity}>
      <Group origin={origin} transform={contentTransform}>
        <CanvasImage
          image={component.data as SkImage}
          fit="contain"
          x={0}
          y={0}
          width={imageWidth}
          height={imageHeight}
        >
          <Blur blur={blur} />
          <ColorMatrix matrix={colorMatrix} />
        </CanvasImage>
      </Group>
    </Group>
  );
};

export default Image;
