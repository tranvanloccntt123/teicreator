import React from "react";
import { Group, Image, Transforms3d } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Component, FitSize } from "@/type/store";
import { ImageURISource } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { resizeComponentFitWorkspace } from "@/utils";

const ImagePreviewFromBase64: React.FC<{
  component: Component;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ component, rootSize }) => {
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

  return (
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
        />
      </Group>
    </Group>
  );
};

export default ImagePreviewFromBase64;
