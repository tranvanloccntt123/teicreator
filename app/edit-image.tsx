import React from "react";
import { Box } from "@/components/ui/box";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { ButtonText, Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import useImageWorkspace from "@/hooks/useImageWorkspace";
import { useLoading } from "@/components/loading/LoadingProvider";
import { initMatrixBackgroundImageWorkspace } from "@/utils/editImage";

const EditImage = () => {
  const loading = useLoading();

  const insets = useSafeAreaInsets();

  const workspace = useImageWorkspace();

  React.useEffect(() => {
    //First load
    if (!workspace?.data?.background) {
      initMatrixBackgroundImageWorkspace();
      loading.hide();
    }
  }, [loading, workspace]);

  // Action Handlers
  const handleAddText = () => {
    console.log("Add Text action triggered");
    // Implement logic for Add Text
  };

  const handleEffect = () => {
    console.log("Effect action triggered");
    // Implement logic for Effect
  };

  const handlePaint = () => {
    console.log("Paint action triggered");
    // Implement logic for Paint
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous screen
  };

  // Handlers for bottom actions
  const handleExportImage = () => {
    console.log("Export Image triggered");
    // Implement export functionality
  };

  const handleShare = () => {
    console.log("Share triggered");
    // Implement share functionality
  };

  return (
    <Box className="flex-1 bg-black relative">
      <SafeAreaView style={{ flex: 1 }}>
        {/* Placeholder View */}
        <Box className="flex-1 bg-white my-4 justify-center items-center rounded-md shadow-md">
          <Text className="text-xl font-bold text-gray-900">Image</Text>
        </Box>
        {/* Actions: Add Text, Effect, Paint at top-right */}
        <Box
          className="absolute top-4 right-4 flex-row space-x-4 gap-2 px-4 py-2"
          style={{ marginTop: insets.top }}
        >
          <Button variant="link" onPress={handleAddText}>
            <MaterialIcons name="text-fields" size={24} color="black" />
          </Button>
          <Button variant="link" onPress={handleEffect}>
            <Ionicons name="filter" size={24} color="black" />
          </Button>
          <Button variant="link" onPress={handlePaint}>
            <FontAwesome name="paint-brush" size={24} color="black" />
          </Button>
        </Box>
        {/* Back Button at top-left */}
        <Box
          className="absolute top-4 left-4 px-4 py-2"
          style={{ marginTop: insets.top }}
        >
          <Button variant="link" onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Button>
        </Box>
        {/* Bottom Actions */}
        <Box className="bg-black py-4">
          <HStack className="justify-around items-center">
            {/* Export Image */}
            <Button
              className="bg-white/[.4] rounded-full"
              onPress={handleExportImage}
            >
              <Ionicons name="download-outline" size={24} color="white" />
              <ButtonText className="text-white ml-2">Export Image</ButtonText>
            </Button>
            {/* Share */}
            <Button
              className="bg-white/[.4] rounded-full"
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={24} color="white" />
              <ButtonText className="text-white ml-2">Share</ButtonText>
            </Button>
          </HStack>
        </Box>
      </SafeAreaView>
    </Box>
  );
};

export default EditImage;
