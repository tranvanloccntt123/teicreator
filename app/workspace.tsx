import React from "react";
import AppStyles from "@/assets/css";
import { Fab } from "@/components/ui/fab";
import { AntDesign } from "@expo/vector-icons";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { WorkspaceControlView } from "@/components/edit/images";
import WorkspaceView from "@/components/edit/images/WorkspaceView";
const Workspace = () => {
  return (
    <Box className="flex-1">
      <Center className="flex-1">
        <WorkspaceView />
      </Center>
      <Center className="absolute top-0 left-0 right-0 bottom-0">
        <WorkspaceControlView />
      </Center>
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
