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

export type EditImageState = {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scale: SharedValue<number>;
  rotate: SharedValue<number>;
  blur: SharedValue<number>;
};

export type Workspace = {
  id: string;
  size: {
    width: number;
    height: number;
  }
}
