import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { EXPAND_FRAME_Z_INDEX } from "@/constants/Workspace";
import useCurrentWorkspace from "@/hooks/useWorkspace";
import { FlatList, TouchableOpacity } from "react-native";
import { Component, WorkspaceSize } from "@/type/store";
import {
  Canvas,
  Image,
  Picture,
  SkImage,
  createPicture,
} from "@shopify/react-native-skia";
import { ScaledSheet, scale } from "react-native-size-matters";
import { fitComponentSize, paintLinePath, setCurrentComponent } from "@/utils";
import { Center } from "@/components/ui/center";
import useColorSchemeStyle from "@/hooks/useColorSchemeStyles";
import { useDerivedValue } from "react-native-reanimated";

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
  const rootSize = useDerivedValue(() =>
    fitComponentSize({
      imageHeight: workspaceSize.height,
      imageWidth: workspaceSize.width,
      widthDimensions: _FRAME_SIZE,
      heightDimensions: _FRAME_SIZE,
    })
  );
  if (component.type === "PAINT") {
    const picture = createPicture((canvas) =>
      paintLinePath(component, canvas, {
        scale: rootSize.value.scale,
        opacity: 1,
      })
    );
    return (
      <TouchableOpacity
        style={{ marginBottom: 15 }}
        onPress={() => setCurrentComponent(component.id)}
      >
        <Center style={styles.frameItemContainer} className="bg-white border-2">
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
