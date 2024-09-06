import React from "react";
import AppStyles from "@/assets/css";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Fab } from "@/components/ui/fab";
import BeautiJson from "@/components/BeautiJson";
import { Box } from "@/components/ui/box";

export default function HomeScreen() {
  return (
    <Box className="flex-1 bg-white">
      <BeautiJson />
      <Fab
        onPress={() => router.navigate("/create-workspace")}
        className="bg-transparent"
      >
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </Box>
  );
}
