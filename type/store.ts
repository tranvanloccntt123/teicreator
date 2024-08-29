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
};

export type WorkspaceSize = {
  width: number;
  height: number;
};

export type WorkspaceBase = {
  id: string;
  size: WorkspaceSize;
};

export type Workspace = WorkspaceBase & {
  components?: Array<Component>;
  componentEditingId?: string;
};

export type DraftWorkspace = WorkspaceBase & {
  components?: Array<Component<number>>;
};

export type Vector = {
  x: number;
  y: number;
};

