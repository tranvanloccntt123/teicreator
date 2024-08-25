import { ImageDataSource } from "@/type/store";
import { calculateNewSizeImage } from "@/utils";
import { DataSourceParam, useImage } from "@shopify/react-native-skia";
import React from "react";

const useScaleImage = ({
  data,
  widthDimensions,
  heightDimensions,
}: {
  data: DataSourceParam;
  widthDimensions: number;
  heightDimensions: number;
}): ImageDataSource => {
  const image = useImage(data);

  const imageSize = (image?.width() || 1) / (image?.height() || 1);

  /* 
    size = width / height
    new_width = new_height * size;
    new_height = new_width / size
  */

  const { width, height } = React.useMemo(() => {
    return calculateNewSizeImage({
      imageHeight: image?.height() || 1,
      imageWidth: image?.width() || 1,
      widthDimensions,
      heightDimensions,
    });
  }, [widthDimensions, image, heightDimensions]);

  return {
    source: image,
    width,
    height,
  };
};

export default useScaleImage;
