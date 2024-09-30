import React from "react";
import { Group, RoundedRect, size } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Workspace } from "@/type/store";
import { scale } from "react-native-size-matters";
import { useDerivedValue } from "react-native-reanimated";

const RoundRootComponent: React.FC<{ workspace: Workspace }> = ({
  workspace,
}) => {
  const { width, height } = useWindowDimensions();

  const origin = React.useMemo(
    () => ({
      x: workspace.size.width / 2,
      y: workspace.size.height / 2,
    }),
    [workspace.size.width, workspace.size.height]
  );

  const x = useDerivedValue(
    () => (width - workspace.viewResize.width.value) / 2
  );

  const y = useDerivedValue(
    () => (height - workspace.viewResize.height.value) / 2
  );

  const componentWidth = useDerivedValue(
    () => workspace.viewResize.width.value
  );

  const componentHeight = useDerivedValue(
    () => workspace.viewResize.height.value
  );

  return (
    <Group color="white" origin={origin}>
      <RoundedRect
        x={x}
        y={y}
        r={scale(5)}
        width={componentWidth}
        height={componentHeight}
      />
    </Group>
  );
};

export default RoundRootComponent;
