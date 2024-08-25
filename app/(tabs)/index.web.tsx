import React from "react";
import AppStyles from "@/assets/css";
import { View, useWindowDimensions } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { ImageUploading } from "@/type/store";
import uuid from "react-native-uuid";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  useWindowDimensions();
  React.useEffect(() => {
    queryClient.setQueryData(
      [QueryKeys.EIDT_IMAGE_UPLOADING],
      (oldData: ImageUploading[]): ImageUploading[] => {
        return [
          ...(oldData || []),
          {
            key: uuid.v4() as string,
            data: require("../../assets/images/preview_test.jpg"),
          },
        ];
      }
    );
  }, []);

  // const uploadImage = async () => {
  //   const imageUploaded = await pickImage();
  //   if (first(imageUploaded?.assets || [])?.base64) {
  //     const imageSize = calculateNewSizeImage({
  //       imageHeight: first(imageUploaded?.assets || [])?.height || 1,
  //       imageWidth: first(imageUploaded?.assets || [])?.width || 1,
  //       widthDimensions: width,
  //       heightDimensions: height,
  //     });
  //     const imageResized = await resizeImage({
  //       base64: `data:image/jpeg;base64,${
  //         first(imageUploaded?.assets || [])?.base64
  //       }`,
  //       width: imageSize.width,
  //       height: imageSize.height,
  //     });
  //     console.log(imageResized);
  //   }
  // };

  return (
    <View style={[AppStyles.container]}>
      <Link href="/create-workspace" style={AppStyles.fabButton}>
        <AntDesign name="plus" size={24} color="black" />
      </Link>
    </View>
  );
}
