import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { Vector, WorkspaceBase, WorkspaceSize } from "@/type/store";
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

export function radFromAngle(newAngle: number, oldRadian: number) {
  type RotationDirection = "clockwise" | "counterClockwise";
  // Factor the angle to a 0 to 1 scale and normalize it to the current
  // value of the animation controller.
  var radian = newAngle / 360 + Math.floor(oldRadian);
  // Determine which dire
  let direction: RotationDirection = "clockwise";

  let clockwise = (radian > oldRadian ? radian : radian + 1.0) - oldRadian;
  let counterClockwise =
    oldRadian - (radian < oldRadian ? radian : radian - 1.0);

  direction = clockwise <= counterClockwise ? "clockwise" : "counterClockwise";

  // Adjust the angle if needed to rotate in the defined direction.
  if (direction === "clockwise") {
    if (radian < oldRadian) {
      radian += 1.0;
    }
  } else {
    if (radian > oldRadian) {
      radian -= 1.0;
    }
  }
  return radian;
}

export const radBetween2Vector = (
  vec1: Vector,
  vec2: Vector,
  radian: number
): number => {
  const angle = angleBetween2Vector(vec1, vec2);
  return radFromAngle(angle, radian || 0);
};

export function angleBetween2Vector(vec1: Vector, vec2: Vector) {
  var deltaX = vec2.x - vec1.x;
  var deltaY = vec2.y - vec1.y;
  var angle = Math.atan2(deltaY, deltaX);
  var degrees = (180 * angle) / Math.PI;
  return degrees; //degrees
}
