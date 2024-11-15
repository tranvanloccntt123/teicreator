import React from "react";
import { Box } from "@/components/ui/box";
import GestureComponent from "../Gesture";
import useCurrentWorkspace from "@/hooks/useWorkspace";
import GestureTapComponent from "../Gesture/components/GestureTapComponent";
import GestureWorkspace from "./components/GestureWorkspace";
import GesturePaintComponent from "../Gesture/GesturePaintComponent";
import { last } from "@/utils";
import { View } from "react-native";

const WorkspaceControlView = () => {
  const { data: workspace } = useCurrentWorkspace();
  const frame = React.useMemo(() => last(workspace?.frames ?? []), [workspace]);
  const currentGesture = React.useMemo(() => {
    if (!workspace?.frameId) {
      return last(workspace.frames);
    }
    const findFrame = workspace.frames.find(frame => frame.id === workspace.frameId);
    if (!workspace.componentEditingId) {
      return findFrame;
    }
    return findFrame.components?.find(component => component.id === workspace.componentEditingId);
  }, [workspace?.frameId, workspace?.componentEditingId])
  return (
    <Box className="flex-1">
      <GestureWorkspace />
      {(frame?.components || []).map((component, index) => {
        if (component.id === workspace?.componentEditingId) {
          switch (component.type) {
            case "PAINT":
              return (
                <GesturePaintComponent
                  component={component}
                  key={component.id}
                  index={index}
                  rootSize={workspace.viewResize}
                />
              );
            default:
              return (
                <GestureComponent
                  component={component}
                  key={component.id}
                  index={index}
                  rootSize={workspace.viewResize}
                />
              );
          }
        }
        return <View key={component.id} />;
      })}
    </Box>
  );
};

export default WorkspaceControlView;
