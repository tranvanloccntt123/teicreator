import React from "react";
import AppStyles from "@/assets/css";
import { Image, ScrollView, useWindowDimensions } from "react-native";
import { pickImage, first, fitComponentSize, resizeImage } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import uuid from "react-native-uuid";
import { makeMutable } from "react-native-reanimated";
import useCurrentWorkspace, {
  pushComponentToCurrentWorkspace,
} from "@/hooks/useWorkspace";
import { Component } from "@/type/store";
import { INIT_MATRIX } from "@/constants/Workspace";
import { Skia } from "@shopify/react-native-skia";
const UploadImage = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: workspace } = useCurrentWorkspace();
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
        widthDimensions: workspace?.size?.height || 1,
        heightDimensions: workspace?.size?.height || 1,
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

  const addImageUploaded = async () => {
    const componentId: string = uuid.v4() as string;
    const data = Skia.Data.fromBase64(image);
    const _image = Skia.Image.MakeImageFromEncoded(data);

    const newComponent: Component = {
      id: componentId,
      data: _image,
      size: imageSize,
      isBase64: true,
      matrix: INIT_MATRIX.map((v) => makeMutable(v)),
      type: "IMAGE",
    };
    pushComponentToCurrentWorkspace(newComponent, queryClient);
    navigation.goBack();
  };

  React.useEffect(() => {
    uploadImage();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack space="xs">
          <Button className="mr-4" onPress={uploadImage}>
            <ButtonText>New</ButtonText>
          </Button>
          {Boolean(image) && (
            <Button className="mr-4 bg-success-300" onPress={addImageUploaded}>
              <ButtonText>Upload</ButtonText>
            </Button>
          )}
        </HStack>
      ),
    });
  }, [image]);

  return (
    <Box className="flex-1">
      <ScrollView style={AppStyles.container}>
        {Boolean(image) && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={{ width, height, resizeMode: "contain" }}
          />
        )}
      </ScrollView>
      {Boolean(imageSize) && (
        <Box className="absolute p-4 bottom-2 left-2 rounded-md bg-primary-100">
          <Text className="text-secondary-100">{`${Math.round(imageSize?.width || 1)} x ${Math.round(imageSize?.height || 1)}`}</Text>
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;
