import React from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { WorkspaceControlView, WorkspaceView } from "@/components/edit/images";
import ExpandComponent from "@/components/edit/images/Expand";

const Workspace = () => {
  return (
    <Box className="flex-1 bg-primary-100">
      <Center className="flex-1">
        <WorkspaceView />
      </Center>
      <Box className="absolute top-0 left-0 right-0 bottom-0">
        <WorkspaceControlView />
      </Box>
      <ExpandComponent />
    </Box>
  );
};

export default Workspace;
