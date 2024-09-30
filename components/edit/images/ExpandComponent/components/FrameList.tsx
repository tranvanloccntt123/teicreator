import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  EXPAND_FRAME_Z_INDEX,
  PAINT_BLEND_MODE,
  PAINT_COLOR_POSITION,
  PAINT_PEN_TYPE,
  PAINT_START_POSITION,
  PAINT_STROKE_CAP,
  PAINT_STROKE_JOIN,
  PAINT_WEIGHT_POSITION,
} from "@/constants/Workspace";
import useCurrentWorkspace, { setCurrentComponent } from "@/hooks/useWorkspace";
import { FlatList, TouchableOpacity } from "react-native";
import { Component, PaintMatrix, PaintType, WorkspaceSize } from "@/type/store";
import {
  Canvas,
  Image,
  Picture,
  SkImage,
  Skia,
  createPicture,
} from "@shopify/react-native-skia";
import { ScaledSheet, scale } from "react-native-size-matters";
import { fitComponentSize } from "@/utils";
import { Center } from "@/components/ui/center";
import useColorSchemeStyle from "@/hooks/useColorSchemeStyles";

const FRAME_SIZE = scale(70);

const FrameItem: React.FC<{
  component: Component;
  workspaceSize: WorkspaceSize;
}> = ({ component, workspaceSize }) => {
  const _FRAME_SIZE = FRAME_SIZE - scale(10);
  const size = React.useMemo(
    () =>
      fitComponentSize({
        imageHeight: component.size.height,
        imageWidth: component.size.width,
        widthDimensions: _FRAME_SIZE,
        heightDimensions: _FRAME_SIZE,
      }),
    [component]
  );
  const rootSize = React.useMemo(
    () =>
      fitComponentSize({
        imageHeight: workspaceSize.height,
        imageWidth: workspaceSize.width,
        widthDimensions: _FRAME_SIZE,
        heightDimensions: _FRAME_SIZE,
      }),
    [component]
  );
  if (component.type === "PAINT") {
    const picture = createPicture((canvas) => {
      const listPath = component.data as PaintMatrix;
      const paint = Skia.Paint();
      listPath.forEach((line) => {
        const color = line[PAINT_COLOR_POSITION] as string;
        const weight = line[PAINT_WEIGHT_POSITION] as number;
        const paintType = line[PAINT_PEN_TYPE] as PaintType;
        paint.setBlendMode(PAINT_BLEND_MODE[paintType]);
        const path = Skia.Path.Make();
        paint.setColor(Skia.Color(color));
        if (line.length === PAINT_START_POSITION + 2) {
          const x = (line[PAINT_START_POSITION] as number) * rootSize.scale;
          const y = (line[PAINT_START_POSITION + 1] as number) * rootSize.scale;
          path.addCircle(x, y, (weight / 1.8) * rootSize.scale);
        } else {
          for (let i = PAINT_START_POSITION; i < line.length - 2; i += 2) {
            const x = (line[i] as number) * rootSize.scale;
            const y = (line[i + 1] as number) * rootSize.scale;
            if (i === PAINT_START_POSITION) {
              path.moveTo(x, y);
              continue;
            }
            path.lineTo(x, y);
          }
          path.stroke({
            width: weight * rootSize.scale,
            cap: PAINT_STROKE_CAP[paintType],
            join: PAINT_STROKE_JOIN[paintType],
          });
        }

        path.close();
        canvas.drawPath(path, paint);
      });
    });
    return (
      <TouchableOpacity
        style={{ marginBottom: 15 }}
        onPress={() => setCurrentComponent(component.id)}
      >
        <Center style={styles.frameItemContainer} className="bg-white">
          <Canvas style={{ width: _FRAME_SIZE, height: _FRAME_SIZE }}>
            <Picture picture={picture} />
          </Canvas>
        </Center>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={{ marginBottom: 15 }}
      onPress={() => setCurrentComponent(component.id)}
    >
      <Center style={styles.frameItemContainer}>
        <Canvas style={{ width: _FRAME_SIZE, height: _FRAME_SIZE }}>
          <Image
            image={component.data as SkImage}
            fit="contain"
            x={0}
            y={0}
            width={size.width || 1}
            height={size.height || 1}
          />
        </Canvas>
      </Center>
    </TouchableOpacity>
  );
};

const FrameList = () => {
  const { data: workspace } = useCurrentWorkspace();
  const colorSchemeStyle = useColorSchemeStyle();
  return (
    <Box
      className="absolute top-2 bottom-2 right-2 rounded-md shadow-md"
      style={{ ...(styles.container as any), ...colorSchemeStyle.box }}
    >
      <Text className="mb-2">Frame</Text>
      <FlatList
        data={workspace.components ?? []}
        keyExtractor={(item, index) => item.id ?? `frame-item-${index}`}
        renderItem={({ item }) => (
          <FrameItem component={item} workspaceSize={workspace.size} />
        )}
      />
    </Box>
  );
};

export default FrameList;

const styles = ScaledSheet.create({
  container: {
    width: FRAME_SIZE + scale(20),
    zIndex: EXPAND_FRAME_Z_INDEX,
    padding: "10@s",
  },
  frameItemContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 15,
  },
});
