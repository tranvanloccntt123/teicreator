import React from "react";
import { Box } from "@/components/ui/box";
import GestureComponent from "./GestureComponent";
import useCurrentWorkspace from "@/hooks/useCurrentWorkspace";
import GestureTabComponent from "./GestureTabComponent";
import GestureTapClearComponent from "./GestureTapClearComponent";

const WorkspaceControlView = () => {
  const { data: workspace } = useCurrentWorkspace();
  return (
    <Box
      style={{
        width: workspace?.size?.width || 1,
        height: workspace?.size?.height || 1,
      }}
    >
      <GestureTapClearComponent />
      {(workspace?.components || []).map((component, index) =>
        component.id === workspace.componentEditingId ? (
          <GestureComponent component={component} key={component.id} />
        ) : (
          <GestureTabComponent
            component={component}
            key={component.id}
            index={index}
          />
        )
      )}
    </Box>
  );
};

export default WorkspaceControlView;
