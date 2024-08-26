import React from "react";
import { Canvas } from "@shopify/react-native-skia";
import AppStyles from "@/assets/css";
import { QueryKeys } from "@/constants/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
const WorkspaceView: React.FC<object> = () => {
  const { data: workspace } = useQuery({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });
  React.useEffect(() => {
    if (!workspace) {
      setTimeout(() => {
        router.navigate("/(tabs)/");
      }, 3000);
    }
  }, [workspace]);
  return (
    <Canvas style={AppStyles.container}>
      <></>
    </Canvas>
  );
};

export default WorkspaceView;
