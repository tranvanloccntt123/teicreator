import React from "react";
import { Group, RoundedRect, size } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Workspace } from "@/type/store";
import { scale } from "react-native-size-matters";
import useCurrentWorkspace from "@/hooks/useWorkspace";

const RoundRootComponent: React.FC<{ workspace: Workspace }> = ({
  workspace,
}) => {
  const { width, height } = useWindowDimensions();

  const rotateOrigin = React.useMemo(
    () => ({
      x: workspace.size.width / 2,
      y: workspace.size.height / 2,
    }),
    [workspace.size.width, workspace.size.height]
  );

  return (
    <Group color="white" origin={rotateOrigin}>
      <RoundedRect
        x={(width - workspace.viewResize.width.value) / 2}
        y={(height - workspace.viewResize.height.value) / 2}
        r={scale(5)}
        width={workspace.viewResize.width}
        height={workspace.viewResize.height}
      />
    </Group>
  );
};

export default RoundRootComponent;
