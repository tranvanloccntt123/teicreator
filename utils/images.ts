import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { FitSize } from "@/type/store";
import { clamp } from "react-native-reanimated";
import { AlphaType, ColorType, SkImage } from "@shopify/react-native-skia";

export {
  getComponentTransform,
  updateComponentTransform,
  componentSize,
  resizePosition,
  resizeComponentFitWorkspace,
  findCurrentComponent,
  rootTranslate,
  temperatureUp,
} from "./workspace";

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

export const fitComponentSize = ({
  imageHeight,
  imageWidth,
  widthDimensions,
  heightDimensions,
}: {
  imageWidth: number;
  imageHeight: number;
  widthDimensions: number;
  heightDimensions: number;
}): FitSize => {
  if (imageWidth <= widthDimensions && imageHeight <= heightDimensions) {
    return {
      width: imageWidth,
      height: imageHeight,
      scale: 1,
    };
  }

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

  const scale = width / imageWidth;

  return {
    width,
    height,
    scale,
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

export const pickColorAt = ({
  image,
  width,
  height,
  x: _x,
  y: _y,
}: {
  image: SkImage;
  width: number;
  height: number;
  x: number;
  y: number;
}) => {
  const resizerX = image.width() / width;
  const resizerY = image.height() / height;
  const x = (width / 2 + _x) * resizerX;
  const y = (height / 2 + _y) * resizerY;

  const pixels = image.readPixels(x, y, {
    colorType: ColorType.RGBA_F32,
    alphaType: AlphaType.Premul,
    height: 1,
    width: 1,
  });

  if (pixels === null) return;

  const r = clamp(Math.round(pixels[0]! * 255), 0, 255);
  const g = clamp(Math.round(pixels[1]! * 255), 0, 255);
  const b = clamp(Math.round(pixels[2]! * 255), 0, 255);
  return { r, g, b };
};
