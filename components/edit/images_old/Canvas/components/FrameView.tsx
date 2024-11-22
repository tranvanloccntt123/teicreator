import React from "react";
import { Group, Transforms3d, RoundedRect } from "@shopify/react-native-skia";
import {
  EditComponent,
  FitSize,
  FrameComponent,
  MatrixIndex,
} from "@/type/store";
import { useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  getComponentTransform,
  resizeComponentFitWorkspace,
  rootTranslate,
} from "@/utils";
import ImagePreviewFromBase64 from "./ImagePreview";

const FrameView: React.FC<{
  frame: FrameComponent;
  rootSize: FitSize<SharedValue<number>>;
}> = ({ frame, rootSize }) => {
  const { width, height } = useWindowDimensions();
  const size = useDerivedValue(() =>
    resizeComponentFitWorkspace(frame, rootSize.scale)
  );
  const contentTransform = useDerivedValue(
    (): Transforms3d => [
      { rotate: getComponentTransform(frame, MatrixIndex.ROTATE) },
      { scale: getComponentTransform(frame, MatrixIndex.SCALE) },
    ]
  );
  const translateTransform = useDerivedValue(
    (): Transforms3d => [
      {
        translateX:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).x +
          getComponentTransform(
            frame,
            MatrixIndex.TRANSLATE_X,
            rootSize.scale.value
          ),
      },
      {
        translateY:
          rootTranslate({
            width,
            height,
            viewHeight: rootSize.height.value,
            viewWidth: rootSize.width.value,
          }).y +
          getComponentTransform(
            frame,
            MatrixIndex.TRANSLATE_Y,
            rootSize.scale.value
          ),
      },
    ]
  );

  const opacity = useDerivedValue(() =>
    getComponentTransform(frame, MatrixIndex.OPACITY)
  );

  const imageWidth = useDerivedValue(() => size.value.width);

  const imageHeight = useDerivedValue(() => size.value.height);

  const origin = useDerivedValue(() => ({
    x: size.value.width / 2,
    y: size.value.height / 2,
  }));

  return (
    <Group transform={translateTransform} opacity={opacity}>
      <Group origin={origin} transform={contentTransform}>
        <RoundedRect
          x={0}
          y={0}
          r={15}
          width={imageWidth}
          height={imageHeight}
        />
        {(frame.components ?? [])
          .filter((component) => component.type === "IMAGE")
          .map((component) => (
            <ImagePreviewFromBase64
              key={component.id}
              component={component}
              rootSize={rootSize}
            />
          ))}
      </Group>
    </Group>
  );
};

export default FrameView;
