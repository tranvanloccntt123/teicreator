import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { EXPAND_FRAME_Z_INDEX } from "@/constants/Workspace";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentWorkspace, { setCurrentComponent } from "@/hooks/useWorkspace";
import { FlatList, TouchableOpacity } from "react-native";
import { Component } from "@/type/store";
import { Canvas, Image, SkImage, Skia } from "@shopify/react-native-skia";
import { ImageURISource } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { fitComponentSize } from "@/utils";
import { Center } from "@/components/ui/center";

const FRAME_SIZE = scale(70);

const FrameItem: React.FC<{ component: Component }> = ({ component }) => {
  if (component.type === "PAINT") {
    return <></>;
  }
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
        renderItem={({ item }) => <FrameItem component={item} />}
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
