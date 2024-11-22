import { SkImage } from "@shopify/react-native-skia";
import { ImageSourcePropType } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type ImageDataSource = {
  source: SkImage | null;
  width: number;
  height: number;
};

export type ImageUploading = {
  key: string;
  data: ImageSourcePropType;
};

export type ComponentType = "IMAGE" | "PAINT";

export type PaintMatrix = (number | string)[][];

export type PaintParams = {
  lastWeight?: number;
  lastColor?: string;
  lastPainType?: PaintType;
};

export type EditComponent<ListParams = SharedValue<number>[]> = {
  id: string;
  data: SkImage | PaintMatrix;
  size: WorkspaceSize;
  matrix: ListParams;
  type: ComponentType;
  params?: PaintParams;
};

export type FrameComponent<ListParams = SharedValue<number>[]> = {
  id: string;
  name: string;
  components: EditComponent[];
  size: WorkspaceSize;
  matrix: ListParams;
  params?: PaintParams;
};

export enum MatrixIndex {
  TRANSLATE_X,
  TRANSLATE_Y,
  SCALE,
  ROTATE,
  BLUR,
  TEMPERATURE_UP,
  OPACITY,
}

export type WorkspaceSize<ValueType = number> = {
  width: ValueType;
  height: ValueType;
};

export type WorkspaceBase = {
  id: string;
  size: WorkspaceSize;
};

export type FitSize<ValueType = number> = WorkspaceSize<ValueType> & {
  scale: ValueType;
};

export type Workspace = WorkspaceBase & {
  components?: EditComponent[];
  frames?: FrameComponent[];
  componentEditingId?: string;
  frameId?: string;
  viewResize: FitSize<SharedValue<number>>;
  paintStatus?: string;
  transform: {
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
  };
};

export type DraftWorkspace = WorkspaceBase & {
  components?: EditComponent<number[]>[];
};

export type Vector = {
  x: number;
  y: number;
};

export type LogType = "Error" | "Warning" | "Info";

export type DevLog = {
  label: string;
  type: LogType;
  data: object | string | number;
  id: string;
};

export enum PaintType {
  PEN,
  HIGH_LIGHT_PEN,
  TICK_PEN,
}

export type ImageComponent<ListParams = SharedValue<number>[]> = {
  data: SkImage;
  matrix?: ListParams;
  size: WorkspaceSize;
};

export type ImageWorkspace = {
  id: string;
  background: string;
  components: ImageComponent[];
  isInit: boolean;
  // viewResize: FitSize<SharedValue<number>>;
};
