import React from "react";
import { Canvas } from "@shopify/react-native-skia";
import { router } from "expo-router";
import ImagePreviewFromBase64 from "./ImagePreview";
import { useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { scale } from "react-native-size-matters";
import useCurrentWorkspace from "@/hooks/useCurrentWorkspace";
const WorkspaceView: React.FC<object> = () => {
  const { width, height } = useWindowDimensions();
  const { data: workspace } = useCurrentWorkspace();
  React.useEffect(() => {
    if (!workspace) {
      setTimeout(() => {
        router.navigate("/(tabs)/");
      }, 3000);
    }
  }, [workspace]);
  return (
    <Box
      style={{
        width: (workspace?.size?.width + scale(10)) || width,
        height: (workspace?.size?.height + scale(10)) || height,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a2a2a350',
        borderRadius: scale(5)
      }}
    >
      <Canvas
        style={{
          width: workspace?.size?.width || width,
          height: workspace?.size?.height || height,
        }}
      >
        {(workspace?.components || [])?.map((component) => (
          <ImagePreviewFromBase64 key={component.id} component={component} />
        ))}
      </Canvas>
    </Box>
  );
};

export default WorkspaceView;
