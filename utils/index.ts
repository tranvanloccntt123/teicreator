import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import {
  Component,
  FitSize,
  MatrixIndex,
  Vector,
  Workspace,
  WorkspaceBase,
  WorkspaceSize,
} from "@/type/store";
import uuid from "react-native-uuid";
import { BTN_OPTION_SIZE } from "@/constants/EditImage";
import { SharedValue, clamp } from "react-native-reanimated";
import { ComponentState } from "react";
import { TEMPERATURE_UP } from "@/constants/Workspace";
import { AlphaType, ColorType, SkImage } from "@shopify/react-native-skia";

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

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const first = <T = any>(arr: Array<T>) => arr?.[0] || undefined;

export const last = <T = any>(arr: Array<T>) =>
  arr?.[arr?.length - 1] || undefined;

export const hasIndex = <T = any>(arr: Array<T>, index: number): boolean =>
  Boolean(arr[index]);

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
    width:
      component.size.width *
      getComponentTransform(component, MatrixIndex.SCALE),
    height:
      component.size.height *
      getComponentTransform(component, MatrixIndex.SCALE),
  };
};

export const resizePosition = (component: Component): Vector => {
  return {
    x: componentSize(component).width / 2 + BTN_OPTION_SIZE / 2,
    y: -componentSize(component).height / 2 - BTN_OPTION_SIZE / 2,
  };
};

export const radToDegree = (radians: number) => radians * (180 / Math.PI);

export const vectorFromRadians = (length: number, radians: number): Vector => {
  const x = length * Math.cos(radians);
  const y = length * Math.sin(radians);

  return { x, y };
};

export const resizeComponentFitWorkspace = (
  component: Component,
  workspaceScale: SharedValue<number>
) => {
  return {
    width: component.size.width * workspaceScale.value,
    height: component.size.height * workspaceScale.value,
  };
};

export const findCurrentComponent = (
  components: Component[],
  componentId: string
) => {
  return components.find((component) => component.id === componentId);
};

export const temperatureUp = (matrixFilter: Array<number>, percent: number) => {
  let _matrixFilter = matrixFilter.concat();
  TEMPERATURE_UP.forEach((color, index) => {
    _matrixFilter[index] += color * percent;
  });
  return _matrixFilter;
};

export const rootTranslate = ({
  width,
  height,
  viewWidth,
  viewHeight,
}: {
  width: number;
  height: number;
  viewWidth: number;
  viewHeight: number;
}) => ({
  x: (width - viewWidth) / 2,
  y: (height - viewHeight) / 2,
});

export const getComponentTransform = (
  component: Component,
  transform: MatrixIndex
) => component.matrix[transform].value;

export const updateComponentTransform = (
  component: Component,
  transform: MatrixIndex,
  value: number
) => {
  component.matrix[transform].value = value;
};

export const scalePathData = (pathData: string, scale: number): string => {
  // Biểu thức chính quy để tìm tất cả các giá trị số (tọa độ x, y) trong chuỗi d
  const pathCommandRegex = /([a-zA-Z])|([+-]?\d*\.?\d+)/g;

  // Phân tích cú pháp path data để lấy các lệnh và tọa độ
  const parts = pathData.match(pathCommandRegex);

  if (!parts) {
    throw new Error("Invalid path data");
  }

  // Mảng mới để chứa path với tọa độ đã được scale
  const scaledParts: string[] = [];

  parts.forEach((part) => {
    // Nếu phần này là một lệnh (chữ cái), chúng ta giữ nguyên
    if (isNaN(Number(part))) {
      scaledParts.push(part);
    } else {
      // Nếu phần này là một tọa độ (số), chúng ta nhân nó với giá trị scale
      const scaledValue = parseFloat(part) * scale;
      scaledParts.push(scaledValue.toString());
    }
  });

  // Kết hợp lại thành một chuỗi `d` mới
  return scaledParts.join(" ");
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
