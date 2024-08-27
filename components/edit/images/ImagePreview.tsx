import React from "react";
import { Image } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";

const ImagePreviewFromBase64: React.FC<{ base64: string }> = ({ base64 }) => {
  const data = Skia.Data.fromBase64(base64);
  const image = Skia.Image.MakeImageFromEncoded(data);
  return (
    <Image
      image={image}
      fit="contain"
      x={0}
      y={0}
      width={image?.width() || 1}
      height={image?.height() || 1}
    />
  );
};

export default ImagePreviewFromBase64;
