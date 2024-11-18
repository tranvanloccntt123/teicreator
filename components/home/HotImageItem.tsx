import React from "react";
import { Image, ImageProps, Pressable } from "react-native";
import { Box } from "../ui/box";
import { StyleSheet } from "react-native";

const HotImageItem: React.FC<{onPress?: () => void} & ImageProps> = ({onPress, ...props }) => {
  return (
    <Box className="overflow-hidden xs:w-1/2 xs:h-1/2 sm:w-1/3 sm:h-1/2 md:w-50 md:h-50 rounded-md lg:w-40 lg:h-40 bg-secondary-50 mx-2 my-1">
      <Pressable onPress={onPress} style={styles.btn}>
        <Image style={styles.image} {...props} />
      </Pressable>
    </Box>
  );
};

export default HotImageItem;

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
