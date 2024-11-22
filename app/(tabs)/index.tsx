import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Fab } from "@/components/ui/fab";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Image, ScrollView } from "react-native";
import AppImages from "@/assets/images/public";
import { HotImageItem } from "@/components/home";
import { useLoading } from "@/components/loading/LoadingProvider";
import { Skia } from "@shopify/react-native-skia";
import { setImageWorkspace } from "@/utils/editImage";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const IMAGE_EXAMPLE =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D";

export default function HomeScreen() {
  const loading = useLoading();

  const [recentImages, _setRecentImages] = React.useState(
    Array.from({ length: 10 }, (_) => AppImages.placeholder400)
  );

  const [hotImages, _setHotImages] = React.useState(
    Array.from({ length: 10 }, (_) => ({ uri: IMAGE_EXAMPLE }))
  );

  const submitImageWorkspace = async (uri: string) => {
    loading.show();
    try {
      setImageWorkspace({
        id: uuid.v4() as string,
        background: uri,
        components: [],
        isInit: true,
      });
      loading.hide();
      router.navigate("/edit-image");
    } catch (e) {
      console.log(e);
      loading.hide();
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 p-6 space-y-4">
          <Text className="text-2xl font-bold text-center text-black">
            Welcome to Image Editor
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-semibold mt-6 text-primary-600">
              Recent Edits
            </Text>
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
            <Text className="text-xl font-semibold mt-6 text-primary-600">
              Hot Images
            </Text>
            <Box className="mt-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hotImages.map((image, index) => (
                  <HotImageItem
                    source={image}
                    key={`hot-image-${index}`}
                    onPress={() => submitImageWorkspace(image.uri)}
                  />
                ))}
              </ScrollView>
            </Box>
          </ScrollView>
        </VStack>
        <Fab onPress={() => {}} className="bg-transparent">
          <AntDesign name="plus" size={24} color="black" />
        </Fab>
      </SafeAreaView>
    </Box>
  );
}
