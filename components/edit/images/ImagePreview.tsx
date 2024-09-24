import React from "react";
import {
  Group,
  Image,
  Transforms3d,
  Skia,
  Blur,
  ColorMatrix,
  SkImage,
} from "@shopify/react-native-skia";
import { Component, FitSize, MatrixIndex } from "@/type/store";
import { ImageURISource, useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  getComponentTransform,
  temperatureUp,
  resizeComponentFitWorkspace,
  rootTranslate,
} from "@/utils";
import { MATRIX_FILTER } from "@/constants/Workspace";

const ImagePreviewFromBase64: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );
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
          }).x + getComponentTransform(component, MatrixIndex.TRANSLATE_X),
      },
      {
        translateY:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).y + getComponentTransform(component, MatrixIndex.TRANSLATE_Y),
      },
    ]
  );

  const blur = useDerivedValue(() =>
    getComponentTransform(component, MatrixIndex.BLUR)
  );
  // R G B A
  // const colorMatrix = [
  //   1,0,0,0,0,
  //   0,1,0,0,0,
  //   0,0,1,0,0,
  //   0,0,0,1,0
  // ];

  const colorMatrix = useDerivedValue(() =>
    temperatureUp(
      MATRIX_FILTER,
      getComponentTransform(component, MatrixIndex.TEMPERATURE_UP)
    )
  );

  const opacity = useDerivedValue(() =>
    getComponentTransform(component, MatrixIndex.OPACITY)
  );

  return (
    <Group transform={translateTransform} opacity={opacity}>
      <Group
        origin={{
          x: size.width / 2,
          y: size.height / 2,
        }}
        transform={contentTransform}
      >
        <Image
          image={component.data as SkImage}
          fit="contain"
          x={0}
          y={0}
          width={size.width || 1}
          height={size.height || 1}
        >
          <Blur blur={blur} />
          <ColorMatrix matrix={colorMatrix} />
        </Image>
      </Group>
    </Group>
  );
};

export default ImagePreviewFromBase64;
