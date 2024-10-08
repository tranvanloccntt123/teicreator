import { Vector } from "@/type/store";

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

export const radToDegree = (radians: number) => radians * (180 / Math.PI);

export const vectorFromRadians = (length: number, radians: number): Vector => {
  const x = length * Math.cos(radians);
  const y = length * Math.sin(radians);

  return { x, y };
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
