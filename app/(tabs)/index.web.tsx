import React from "react";
import AppStyles from "@/assets/css";
import { View } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Fab } from "@/components/ui/fab";

export default function HomeScreen() {
  return (
    <View style={[AppStyles.container]}>
      <Fab onPress={() => router.navigate('/create-workspace')} className="bg-transparent">
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </View>
  );
}
