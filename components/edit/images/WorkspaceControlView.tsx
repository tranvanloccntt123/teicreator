import React from "react";
import { Box } from "@/components/ui/box";
import GestureComponent from "./GestureComponent";
import useCurrentWorkspace from "@/hooks/useWorkspace";
import GestureTapComponent from "./GestureComponent/components/GestureTapComponent";
import GestureWorkspace from "./GestureWorkspace";
import GesturePaintComponent from "./GesturePaintComponent";

const WorkspaceControlView = () => {
  const { data: workspace } = useCurrentWorkspace();
  return (
    <Box className="flex-1">
      <GestureWorkspace />
      {(workspace?.components || []).map((component, index) => {
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
        return (
          <GestureTapComponent
            component={component}
            key={component.id}
            index={index}
            rootSize={workspace.viewResize}
          />
        );
      })}
    </Box>
  );
};

export default WorkspaceControlView;
