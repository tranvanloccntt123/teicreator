import React from "react";
import { Box } from "@/components/ui/box";
import { first, fitComponentSize, pickImage } from "@/utils";
import { useWindowDimensions } from "react-native";

const EditImage = () => {
  const { width, height } = useWindowDimensions();
  const [image, setImage] = React.useState<string>();
  const [imageSize, setImageSize] = React.useState<{
    width: number;
    height: number;
  }>();
  const uploadImage = async () => {
    const imageUploaded = await pickImage();
    if (first(imageUploaded?.assets || [])?.base64) {
      const imageSize = fitComponentSize({
        imageHeight: first(imageUploaded?.assets || [])?.height || 1,
        imageWidth: first(imageUploaded?.assets || [])?.width || 1,
        widthDimensions: width || 1,
        heightDimensions: height || 1,
      });
      setImageSize(imageSize);
      // const imageResized = await resizeImage({
      //   base64: `data:image/jpeg;base64,${
      //     first(imageUploaded?.assets || [])?.base64
      //   }`,
      //   width: imageSize.width,
      //   height: imageSize.height,
      // });
      // setImage(
      //   `data:image/jpeg;base64,${first(imageUploaded?.assets || [])?.base64}`
      // );
      setImage(first(imageUploaded?.assets || [])?.base64);
    }
  };

  React.useEffect(() => {
    uploadImage();
  }, []);
  return <Box className="box-1 bg-white"></Box>;
};

export default EditImage;
