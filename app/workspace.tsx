import React from "react";
import { Fab } from "@/components/ui/fab";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { WorkspaceControlView } from "@/components/edit/images";
import WorkspaceView from "@/components/edit/images/WorkspaceView";
import ExpandComponent from "@/components/edit/images/ExpandComponent";

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
      <Fab
        onPress={() => router.navigate("/upload-image")}
        className="bg-white"
      >
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </Box>
  );
};

export default Workspace;
