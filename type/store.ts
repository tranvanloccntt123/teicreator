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

export type Component<TransformType = SharedValue<number>> = {
  id: string;
  data: ImageSourcePropType;
  isBase64?: boolean;
  translateX: TransformType;
  translateY: TransformType;
  scale: TransformType;
  rotate: TransformType;
  blur: TransformType;
  size: WorkspaceSize;
  lightUpPercent: TransformType;
};

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
  components?: Array<Component>;
  componentEditingId?: string;
  viewResize: FitSize<SharedValue<number>>;
};

export type DraftWorkspace = WorkspaceBase & {
  components?: Array<Component<number>>;
};

export type Vector = {
  x: number;
  y: number;
};

export type LogType = "Error" | "Warning" | "Info";

export type DevLog = {
  label: string;
  type: LogType;
  data: Object | string | number;
  id: string;
};
