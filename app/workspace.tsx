import React from "react";
import AppStyles from "@/assets/css";
import { Fab } from "@/components/ui/fab";
import { AntDesign } from "@expo/vector-icons";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { ScrollView, Text } from "react-native";
import { router } from "expo-router";

const Workspace = () => {
  return (
    <ScrollView style={AppStyles.container}>
      <WithSkiaWeb
        getComponent={() => import("@/components/edit/images/WorkspaceView")}
        fallback={<Text>Loading Skia...</Text>}
      />
      <Fab onPress={() => router.navigate('/upload-image')} className="bg-transparent">
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </ScrollView>
  );
};

export default Workspace;
