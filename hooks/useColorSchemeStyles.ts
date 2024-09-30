import { Colors } from "@/constants/Colors";
import { TextStyle, ViewStyle, useColorScheme } from "react-native";

type ColorSchemeStyle = {
  text: TextStyle;
  box: ViewStyle;
  icon: {
    color?: string;
  };
};

const useColorSchemeStyle = (): ColorSchemeStyle => {
  const colorScheme = useColorScheme();
  return {
    text: {
      color: Colors[colorScheme ?? "light"].text,
    },
    box: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    icon: {
        color: Colors[colorScheme ?? "light"].icon,
    }
  };
};

export default useColorSchemeStyle;
