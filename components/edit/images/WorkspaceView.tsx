import React from "react";
import { Canvas } from "@shopify/react-native-skia";
import { router } from "expo-router";
import ImagePreviewFromBase64 from "./ImagePreview";
import { useWindowDimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { scale, verticalScale } from "react-native-size-matters";
import useCurrentWorkspace from "@/hooks/useWorkspace";
import RoundRootComponent from "./RoundRootComponent";
import { fitComponentSize } from "@/utils";
import Painting from "./Painting";
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

  React.useEffect(() => {
    const fitRootView = fitComponentSize({
      imageHeight: workspace.size.height,
      imageWidth: workspace.size.width,
      widthDimensions: width - scale(15),
      heightDimensions: height - verticalScale(50),
    });
    workspace.viewResize.width.value = fitRootView.width;
    workspace.viewResize.height.value = fitRootView.height;
    workspace.viewResize.scale.value = fitRootView.scale;
  }, [workspace, width, height]);

  return (
    <Box
      style={{
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#a2a2a350",
        borderRadius: scale(5),
      }}
    >
      <Canvas
        style={{
          width: width,
          height: height,
        }}
      >
        <RoundRootComponent workspace={workspace} />
        {(workspace?.components || [])?.map((component) => {
          switch (component.type) {
            case "PAINT":
              return (
                <Painting
                  key={component.id}
                  rootSize={workspace.viewResize}
                  component={component}
                />
              );
            default:
              return (
                <ImagePreviewFromBase64
                  key={component.id}
                  rootSize={workspace.viewResize}
                  component={component}
                />
              );
          }
        })}
      </Canvas>
    </Box>
  );
};

export default WorkspaceView;
