import React from "react";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Fab } from "@/components/ui/fab";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Image, ScrollView } from "react-native";
import AppImages from "@/assets/images/public";

export default function HomeScreen() {
  const [recentImages, _setRecentImages] = React.useState(
    Array.from({ length: 10 }, (_) => AppImages.placeholder400)
  );

  return (
    <Box className="flex-1 bg-white">
      <VStack className="flex-1 p-6 space-y-4">
        <Text className="text-2xl font-bold text-center">
          Welcome to Image Editor
        </Text>
        <Text className="text-xl font-semibold mt-6">Recent Edits</Text>
        <Box className="mt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentImages.map((image, index) => (
              <Box
                key={index}
                className="mr-4 w-40 h-40 rounded-md overflow-hidden"
              >
                <Image
                  source={image}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            ))}
          </ScrollView>
        </Box>
      </VStack>
      <Fab
        onPress={() => router.navigate("/create-workspace")}
        className="bg-transparent"
      >
        <AntDesign name="plus" size={24} color="black" />
      </Fab>
    </Box>
  );
}
