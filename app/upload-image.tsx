import React from "react";
import AppStyles from "@/assets/css";
import { Image, ScrollView, useWindowDimensions } from "react-native";
import { pickImage, first, calculateNewSizeImage, resizeImage } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { Workspace } from "@/type/store";

const UploadImage = () => {
  const { data: workspace } = useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });
  const { width, height } = useWindowDimensions();
  const [image, setImage] = React.useState<string>();
  const [imageSize, setImageSize] = React.useState<{
    width: number;
    height: number;
  }>();

  React.useEffect(() => {
    const uploadImage = async () => {
      const imageUploaded = await pickImage();
      if (first(imageUploaded?.assets || [])?.base64) {
        const imageSize = calculateNewSizeImage({
          imageHeight: first(imageUploaded?.assets || [])?.height || 1,
          imageWidth: first(imageUploaded?.assets || [])?.width || 1,
          widthDimensions: workspace?.size?.height || 1,
          heightDimensions: workspace?.size?.height || 1,
        });
        setImageSize(imageSize);
        const imageResized = await resizeImage({
          base64: `data:image/jpeg;base64,${
            first(imageUploaded?.assets || [])?.base64
          }`,
          width: imageSize.width,
          height: imageSize.height,
        });
        setImage(`data:image/jpeg;base64,${imageResized}`);
      }
    };
    uploadImage();
  }, []);
  return (
    <ScrollView style={AppStyles.container}>
      {Boolean(image) && (
        <Image
          source={{ uri: image }}
          style={{ width, height, resizeMode: "contain" }}
        />
      )}
    </ScrollView>
  );
};

export default UploadImage;
