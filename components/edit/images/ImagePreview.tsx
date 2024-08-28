import React from "react";
import { Group, Image, Transforms3d } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Component } from "@/type/store";
import { ImageURISource } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const ImagePreviewFromBase64: React.FC<{ component: Component }> = ({
  component,
}) => {
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
  const rotateTransform = useDerivedValue(
    (): Transforms3d => [{ rotate: component.rotate.value }],
    [component.rotate]
  );
  const translateTransform = useDerivedValue(
    (): Transforms3d => [
      { translateX: component.translateX.value },
      { translateY: component.translateY.value },
    ],
    [component.translateX, component.translateY]
  );
  const rotateOrigin = useDerivedValue(
    () => ({
      x: component.size.width / 2,
      y: component.size.height / 2,
    }),
    [component.translateX, component.translateY]
  );
  return (
    <Group transform={translateTransform}>
      <Group origin={rotateOrigin} transform={rotateTransform}>
        <Image
          image={image}
          fit="contain"
          x={0}
          y={0}
          width={image?.width() || 1}
          height={image?.height() || 1}
        />
      </Group>
    </Group>
  );
};

export default ImagePreviewFromBase64;
