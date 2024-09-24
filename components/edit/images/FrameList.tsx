import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { EXPAND_FRAME_Z_INDEX } from "@/constants/Workspace";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentWorkspace, { setCurrentComponent } from "@/hooks/useWorkspace";
import { FlatList, TouchableOpacity } from "react-native";
import { Component, PaintMatrix, WorkspaceSize } from "@/type/store";
import {
  BlendMode,
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

const FRAME_SIZE = scale(70);

const FrameItem: React.FC<{
  component: Component;
  workspaceSize: WorkspaceSize;
}> = ({ component, workspaceSize }) => {
  const queryClient = useQueryClient();
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
      paint.setBlendMode(BlendMode.Multiply);
      paint.setColor(Skia.Color("#000000"));
      const path = Skia.Path.Make();
      listPath.forEach((line) => {
        for (let i = 0; i < line.length - 2; i += 2) {
          const x = line[i] * rootSize.scale;
          const y = line[i + 1] * rootSize.scale;
          if (i === 0) {
            path.moveTo(x, y);
            continue;
          }
          path.lineTo(x, y);
        }
      });
      path.stroke({ width: 1 });
      path.close();
      canvas.drawPath(path, paint);
    });
    return (
      <TouchableOpacity
        onPress={() => setCurrentComponent(component.id, queryClient)}
      >
        <Center style={styles.frameItemContainer}>
          <Canvas style={{ width: _FRAME_SIZE, height: _FRAME_SIZE }}>
            <Picture picture={picture} />
          </Canvas>
        </Center>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => setCurrentComponent(component.id, queryClient)}
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
  const queryClient = useQueryClient();

  const { data: workspace } = useCurrentWorkspace();
  return (
    <Box
      className="absolute top-2 bottom-2 right-2 rounded-md bg-white shadow-md"
      style={styles.container}
    >
      <Text>Frame</Text>
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
  },
});
