import { scale } from "react-native-size-matters";
import * as d3Scale from "d3-scale";

export const GESTURE_Z_INDEX = 4000;
export const COMPONENT_Z_INDEX = 1000;
export const GESTURE_TAP_Z_INDEX = 3000;
export const HEADER_Z_INDEX = 2000;
export const EXPAND_COMPONENT_Z_INDEX = 6000;
export const EXPAND_WIDTH = scale(150);
export const EXPAND_CLOSE_POSITION = -scale(250);
export const EXPAND_OPEN_POSITION = scale(5);
export const BORDER_COMPONENT = d3Scale.scaleLinear([0, 100], [0, scale(100)]);
export const MAX_BLUR = 50;
export const MIN_BLUR = 0;
export const BLUR_STEP = 1;
export const MAX_LIGHT_UP = 100;
export const MIN_LIGHT_UP = 0;
export const LIGHT_UP_STEP = 1;
export const UP_LIGHT = [
  0.018, 0, 0, 0, 0, 0, 0.013, 0, 0, 0, 0, 0, 0.012, 0, 0, 0, 0, 0, 0, 0,
];
export const UP_PINK = [
  1.3, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0,
];
// R G B A
// const colorMatrix = [
//   1,0,0,0,0,
//   0,1,0,0,0,
//   0,0,1,0,0,
//   0,0,0,1,0
// ];
export const MATRIX_FILTER = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];
