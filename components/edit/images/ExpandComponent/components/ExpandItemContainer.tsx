import { Box } from "@/components/ui/box";
import React from "react";
import styles from "./styles";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const ExpandItemContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const colorSchema = useColorScheme();
  return (
    <Box
      style={{
        ...(styles.toolContainer as any),
        backgroundColor: Colors[colorSchema ?? "light"].background,
      }}
      className="bg-white rounded-xl shadow-md px-4 py-2"
    >
      {children}
    </Box>
  );
};

export default ExpandItemContainer;
