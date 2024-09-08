import React from "react";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Fab } from "@/components/ui/fab";
import { Box } from "@/components/ui/box";

export default function HomeScreen() {
  return (
    <Box className="flex-1 bg-white">
      <Fab
        onPress={() => router.navigate("/create-workspace")}
        className="bg-transparent"
      >
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </Box>
  );
}
