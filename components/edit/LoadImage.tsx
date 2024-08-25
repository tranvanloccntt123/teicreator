import React from "react";
import {
  useWindowDimensions,
  ImageSourcePropType,
  ImageURISource,
} from "react-native";
import AppStyles from "@/assets/css";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { ImageUploading } from "@/type/store";
import useScaleImage from "@/hooks/useScaleImage";
import { DataSourceParam, SkiaDomView } from "@shopify/react-native-skia";
import { Canvas, Image } from "@shopify/react-native-skia";
const LoadingImage: React.FC<{ data: ImageSourcePropType }> = ({ data }) => {
  const { width, height } = useWindowDimensions();
  const ref = React.useRef<SkiaDomView>(null);

  const imageData = useScaleImage({
    data: ((data as ImageURISource).uri
      ? (data as ImageURISource).uri
      : data) as DataSourceParam,
    widthDimensions: width,
    heightDimensions: height,
  });

  React.useEffect(() => {
    const snapImage = async () => {
      try {
        const snap = await ref.current?.makeImageSnapshot();
        console.log(snap?.encodeToBase64());
      } catch (e) {}
    };
    if (imageData.source) {
      setTimeout(() => {
        snapImage();
      }, 3000);
    }
  }, [imageData.source]);

  return (
    <Canvas
      ref={ref}
      style={{ width: imageData.width, height: imageData.height }}
    >
      <Image
        image={imageData.source}
        fit="contain"
        x={0}
        y={0}
        width={imageData.width}
        height={imageData.height}
      />
    </Canvas>
  );
};

const LoadImage: React.FC<object> = () => {
  const imageUploading = useQuery<unknown, unknown, ImageUploading[]>({
    queryKey: [QueryKeys.EIDT_IMAGE_UPLOADING],
  });

  return imageUploading?.data?.length ? (
    <LoadingImage
      key={imageUploading?.data[0].key}
      data={imageUploading?.data[0].data}
    />
  ) : (
    <Canvas style={AppStyles.container}>
      <></>
    </Canvas>
  );
};

export default LoadImage;
