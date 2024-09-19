import React from "react";
import {
  Group,
  Image,
  Transforms3d,
  Skia,
  Blur,
  ColorMatrix,
} from "@shopify/react-native-skia";
import { Component, FitSize } from "@/type/store";
import { ImageURISource, useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { lightUp, resizeComponentFitWorkspace, rootTranslate } from "@/utils";
import { MATRIX_FILTER } from "@/constants/Workspace";

const ImagePreviewFromBase64: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const base64 = React.useMemo(
    () =>
      (component.data as ImageURISource).uri?.replace(
        "data:image/jpeg;base64,",
        ""
      ),
    [component]
  );
  const data = Skia.Data.fromBase64(base64);
  const image = Skia.Image.MakeImageFromEncoded(data);
  const size = React.useMemo(
    () => resizeComponentFitWorkspace(component, rootSize.scale),
    [component]
  );
  const contentTransform = useDerivedValue(
    (): Transforms3d => [
      { rotate: component.rotate.value },
      { scale: component.scale.value },
    ],
    [component.rotate]
  );
  const translateTransform = useDerivedValue(
    (): Transforms3d => [
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
    ],
    [component.translateX, component.translateY]
  );

  const blur = useDerivedValue(() => component.blur.value, [component.blur]);
  // R G B A
  // const colorMatrix = [
  //   1,0,0,0,0,
  //   0,1,0,0,0,
  //   0,0,1,0,0,
  //   0,0,0,1,0
  // ];

  const colorMatrix = useDerivedValue(() =>
    lightUp(MATRIX_FILTER, component.lightUpPercent.value)
  );

  const rootTransform = useDerivedValue(
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
    ],
    []
  );

  return (
    <Group transform={rootTransform}>
      <Group transform={translateTransform}>
        <Group
          origin={{
            x: size.width / 2,
            y: size.height / 2,
          }}
          transform={contentTransform}
        >
          <Image
            image={image}
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
    </Group>
  );
};

export default ImagePreviewFromBase64;
