import { scale } from "react-native-size-matters";
import * as d3Scale from "d3-scale";

export const GESTURE_Z_INDEX = 4000;
export const COMPONENT_Z_INDEX = 1000;
export const GESTURE_TAP_Z_INDEX = 3000;
export const HEADER_Z_INDEX = 2000;
export const TOOL_COMPONENT_Z_INDEX = 6000;
export const EXPAND_COMPONENT_Z_INDEX = 6001;
export const EXPAND_FRAME_Z_INDEX = 6002;
export const EXPAND_WIDTH = scale(150);
export const EXPAND_CLOSE_POSITION = -scale(250);
export const EXPAND_OPEN_POSITION = scale(5);
export const BORDER_COMPONENT = d3Scale.scaleLinear([0, 100], [0, scale(100)]);
export const MAX_BLUR = 50;
export const MIN_BLUR = 0;
export const BLUR_STEP = 1;
export const MAX_TEMPERATURE_UP = 100;
export const MIN_TEMPERATURE_UP = 0;
export const TEMPERATURE_UP_STEP = 1;
export const TEMPERATURE_UP = [
  0.018, 0, 0, 0, 0, 0, 0.013, 0, 0, 0, 0, 0, 0.012, 0, 0, 0, 0, 0, 0, 0,
];
export const UP_PINK = [
  1.3, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 0, 0, 0,
];
export const MAX_OPACITY = 100;
export const MIN_OPACITY = 0;
export const OPACITY_STEP = 1;
export const MIN_PAINT_WEIGHT = 1;
export const MAX_PAINT_WEIGHT = 50;
export const PAINT_WEIGHT_STEP = 0.5;
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

export const INIT_MATRIX = [0, 0, 1, 0, 0, 0, 1];

export const PAINT_WEIGHT = [3, 5, 8, 9, 12, 11];

export const PAINT_COLOR_POSITION = 0;

export const PAINT_WEIGHT_POSITION = 1;

export const PAINT_START_POSITION = 2;

export const COLOR = [
  [
    "#FFFFFF",
    "#000000",
    "#3897EF",
    "#70BF50",
    "#FFDD30",
    "#FC8D32",
    "#EC4956",
    "#D10869",
    "#A007B7",
  ],
  [
    "#ED0013",
    "#EC858E",
    "#FFD1D3",
    "#FFDAB4",
    "#FFC282",
    "#D18E46",
    "#996439",
    "#432324",
    "#1B4828",
  ],
  [
    "#262626",
    "#363636",
    "#555555",
    "#727272",
    "#999999",
    "#B2B2B2",
    "#C6C6C6",
    "#DADADA",
    "#E2E2E2",
  ],
];
