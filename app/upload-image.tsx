import React from "react";
import AppStyles from "@/assets/css";
import { Image, ScrollView, useWindowDimensions } from "react-native";
import { pickImage, first, calculateNewSizeImage, resizeImage } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { DraftWorkspace, Workspace } from "@/type/store";
import { useNavigation } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import uuid from "react-native-uuid";
import { makeMutable } from "react-native-reanimated";
const UploadImage = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: workspace } = useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });
  const { width, height } = useWindowDimensions();
  const [image, setImage] = React.useState<string>();
  const [imageSize, setImageSize] = React.useState<{
    width: number;
    height: number;
  }>();

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

  const addImageUploaded = async () => {
    const componentId: string = uuid.v4() as string;
    const newComponent = {
      id: componentId,
      data: { uri: image },
      translateX: makeMutable(0),
      translateY: makeMutable(0),
      scale: makeMutable(1),
      rotate: makeMutable(0),
      blur: makeMutable(0),
      size: imageSize,
      isBase64: true,
    };
    const newDraftComponent = {
      id: componentId,
      data: { uri: image },
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotate: 0,
      blur: 0,
      size: imageSize,
      isBase64: true,
    };
    queryClient.setQueryData(
      [QueryKeys.CURRENT_WORKSPACE],
      (oldData: Workspace): Workspace => ({
        ...oldData,
        components: [...(oldData?.components || []), newComponent],
      })
    );
    queryClient.setQueryData(
      [QueryKeys.DRAFT_WORKSPACE],
      (oldData: DraftWorkspace): DraftWorkspace => ({
        ...oldData,
        components: [...(oldData?.components || []), newDraftComponent],
      })
    );
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
            source={{ uri: image }}
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
