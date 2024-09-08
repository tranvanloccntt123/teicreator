import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { Component, Vector, WorkspaceBase, WorkspaceSize } from "@/type/store";
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

export const distanceBetween2Vector = (vec1: Vector, vec2: Vector) => {
  return Math.sqrt(Math.pow(vec2.x - vec1.x, 2) + Math.pow(vec2.y - vec1.y, 2));
};

export const vectorOnCircleLine = (vec1: Vector, R: number) => {
  // Khởi tạo vector ban đầu với tọa độ x, y
  let vector = { x: vec1.x, y: vec1.y }; // Vector với tọa độ x, y

  // Tính độ dài của vector ban đầu
  let vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  // Độ dài của vector mới cùng hướng
  let newLength = R; // Độ dài của vector mới được nhập vào

  // Chuẩn hóa vector ban đầu để tìm vector đơn vị
  let unitVector = {
    x: vector.x / vectorLength,
    y: vector.y / vectorLength,
  };

  // Tính tọa độ của vector mới có độ dài newLength
  let newVector = {
    x: unitVector.x * newLength,
    y: unitVector.y * newLength,
  };
  return newVector;
};

export const vectorOnDiagonalLine = (
  vec1: Vector,
  RWidth: number,
  RHeight: number
) => {
  // Khởi tạo tọa độ của vector A
  const vector = { x: RWidth, y: RHeight };

  // Biết trước Y của vector B
  const Y_B = vec1.y;

  // Tìm tọa độ X của vector B
  const X_B = vector.x * (Y_B / vector.y);

  return { x: X_B, y: Y_B };
};

export const componentSize = (component: Component) => {
  return {
    width: component.size.width * component.scale.value,
    height: component.size.height * component.scale.value,
  };
};

export const resizePosition = (component: Component): Vector => {
  return {
    x: -(component.size.width - componentSize(component).width) / 2,
    y: (component.size.height - componentSize(component).height) / 2,
  };
};

export const radToDegree = (radians: number) => radians * (180 / Math.PI);
