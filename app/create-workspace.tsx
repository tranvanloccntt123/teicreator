import AppStyles from "@/assets/css";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import React from "react";
import { Text, View } from "react-native";

const CreateWorkspace = () => {
  return (
    <View style={AppStyles.container}>
      <Center className="bg-primary-100 flex-1">
        <Box className="bg-secondary-100 p-5 rounded-md ">
          <Text>Create Workspace</Text>
        </Box>
      </Center>
    </View>
  );
};

export default CreateWorkspace;
