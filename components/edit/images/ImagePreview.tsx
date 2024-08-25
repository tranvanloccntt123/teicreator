import React from "react";
import { AlphaType, Canvas, ColorType, Image } from "@shopify/react-native-skia";
import AppStyles from "@/assets/css";
import { Skia } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import useScaleImage from "@/hooks/useScaleImage";

const ImagePreview: React.FC<object> = () => {
  const { width, height } = useWindowDimensions();

  const image = useScaleImage({
    data: require("../../../assets/images/preview_test.jpg"),
    widthDimensions: width,
    heightDimensions: height,
  });

  return (
    <Canvas style={AppStyles.container}>
      <Image
        image={image.source}
        fit="contain"
        x={0}
        y={0}
        width={image.width}
        height={image.height}
      />
    </Canvas>
  );
};

export default ImagePreview;
