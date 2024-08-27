import React from "react";
import { Canvas } from "@shopify/react-native-skia";
import AppStyles from "@/assets/css";
import { QueryKeys } from "@/constants/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Workspace } from "@/type/store";
import ImagePreviewFromBase64 from "./ImagePreview";
import { ImageURISource, useWindowDimensions } from "react-native";
const WorkspaceView: React.FC<object> = () => {
  const { width, height } = useWindowDimensions();
  const { data: workspace } = useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });
  React.useEffect(() => {
    if (!workspace) {
      setTimeout(() => {
        router.navigate("/(tabs)/");
      }, 3000);
    }
  }, [workspace]);
  return (
    <Canvas
      style={{
        width: workspace?.size?.width || width,
        height: workspace?.size?.height || height,
      }}
    >
      {(workspace?.components || [])?.map((component) => (
        <ImagePreviewFromBase64
          key={component.id}
          base64={(component.data as ImageURISource).uri?.replace(
            "data:image/jpeg;base64,",
            ""
          )}
        />
      ))}
    </Canvas>
  );
};

export default WorkspaceView;
