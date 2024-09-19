import React from "react";
import { Box } from "@/components/ui/box";
import GestureComponent from "./GestureComponent";
import useCurrentWorkspace from "@/hooks/useWorkspace";
import GestureTapComponent from "./GestureTapComponent";
import GestureTapClearComponent from "./GestureTapClearComponent";

const WorkspaceControlView = () => {
  const { data: workspace } = useCurrentWorkspace();
  return (
    <Box className="flex-1">
      <GestureTapClearComponent />
      {(workspace?.components || []).map((component, index) =>
        component.id === workspace?.componentEditingId ? (
          <GestureComponent
            component={component}
            key={component.id}
            index={index}
            rootSize={workspace.viewResize}
          />
        ) : (
          <GestureTapComponent
            component={component}
            key={component.id}
            index={index}
            rootSize={workspace.viewResize}
          />
        )
      )}
    </Box>
  );
};

export default WorkspaceControlView;
