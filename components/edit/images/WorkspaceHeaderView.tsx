import { Box } from "@/components/ui/box";
import { HEADER_Z_INDEX } from "@/constants/Workspace";
import useCurrentWorkspace, { deleteComponentById } from "@/hooks/useWorkspace";
import React from "react";
import Animated from "react-native-reanimated";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";

const WorkspaceHeaderView = () => {
  const { data: workspace } = useCurrentWorkspace();

  const deleteCurrentComponent = () => {
    deleteComponentById(workspace?.componentEditingId);
  };

  return (
    <Animated.View style={[styles.container]}>
      <Box className="flex-1 bg-primary-600 p-4">
        {Boolean(workspace?.componentEditingId) && (
          <HStack className="items-center">
            <Button
              className="bg-transparent"
              onPress={deleteCurrentComponent}
              variant="solid"
            >
              <AntDesign name="delete" size={scale(14)} color="white" />
            </Button>
          </HStack>
        )}
      </Box>
    </Animated.View>
  );
};

export default WorkspaceHeaderView;

const styles = ScaledSheet.create({
  container: {
    position: "absolute",
    zIndex: HEADER_Z_INDEX,
    top: 0,
    left: 0,
    right: 0,
    height: "28@s",
  },
});
