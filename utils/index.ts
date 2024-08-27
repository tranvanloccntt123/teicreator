import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { WorkspaceBase, WorkspaceSize } from "@/type/store";
import uuid from "react-native-uuid";

export const pickImage =
  async (): Promise<ImagePicker.ImagePickerResult | null> => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      return result;
    }
    return null;
  };

export const calculateNewSizeImage = ({
  imageHeight,
  imageWidth,
  widthDimensions,
  heightDimensions,
}: {
  imageWidth: number;
  imageHeight: number;
  widthDimensions: number;
  heightDimensions: number;
}) => {
  const imageSize = (imageWidth || 1) / (imageHeight || 1);
  /* 
    size = width / height
    new_width = new_height * size;
    new_height = new_width / size
  */

  let width = widthDimensions;
  const tmpHeight = width / imageSize;
  if (tmpHeight > heightDimensions) {
    width = heightDimensions * imageSize;
  }

  const height = width / imageSize;
  return {
    width,
    height,
  };
};

export const resizeImage = async ({
  base64,
  width,
  height,
}: {
  base64: string;
  width: number;
  height: number;
}) => {
  const manipResult = await manipulateAsync(
    base64,
    [
      {
        resize: {
          height,
          width,
        },
      },
    ],
    { base64: true }
  );
  return manipResult.base64 || "";
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const first = <T = any>(arr: Array<T>) => arr?.[0] || undefined;

export const last = <T = any>(arr: Array<T>) =>
  arr?.[arr?.length - 1] || undefined;

export const createNewWorspace = ({
  size,
}: {
  size: WorkspaceSize;
}): WorkspaceBase => ({
  id: uuid.v4() as string,
  size,
});
