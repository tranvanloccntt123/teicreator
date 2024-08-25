import AppStyles from "@/assets/css";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const UploadImage = () => {
  return (
    <ScrollView style={AppStyles.container}>
      <WithSkiaWeb
        getComponent={() => import("@/components/edit/LoadImage")}
        fallback={<Text>Loading Skia...</Text>}
      />
    </ScrollView>
  );
};

export default UploadImage;
