import React from "react";
import {
  Image,
  ImageProps,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Box } from "../ui/box";
import { StyleSheet } from "react-native";
import ViewResponsive, {
  ViewResponsiveStyle,
} from "../ui/view-responsive/ViewResponsive";
import { scale } from "react-native-size-matters";

const HotImageItem: React.FC<{ onPress?: () => void } & ImageProps> = ({
  onPress,
  ...props
}) => {
  const { width } = useWindowDimensions();
  const containerResponsiveStyle: ViewResponsiveStyle = React.useMemo(
    () => ({
      xs: {
        width: width / 2,
        height: width / 2,
      },
      sm: {
        width: width / 3,
        height: width / 3,
      },
      md: {
        width: scale(50),
        height: scale(50),
      },
      lg: {
        width: scale(40),
        height: scale(40),
      },
    }),
    [width]
  );
  return (
    <ViewResponsive
      responsive={containerResponsiveStyle}
      className="overflow-hidden rounded-md bg-secondary-50 px-2 my-1"
    >
      <Pressable onPress={onPress} style={styles.btn}>
        <Image style={styles.image} {...props} />
      </Pressable>
    </ViewResponsive>
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
