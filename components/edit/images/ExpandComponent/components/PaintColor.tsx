import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/Workspace";
import { Component } from "@/type/store";
import { scale } from "react-native-size-matters";
import { Pressable, ScrollView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { updatePaintParams } from "@/hooks/useWorkspace";
import ExpandItemContainer from "./ExpandItemContainer";

const PaintColor: React.FC<{ component?: Component }> = ({ component }) => {
  const [colorSelect, setColorSelect] = React.useState<string>(COLOR[0][1]);
  React.useEffect(() => {
    setColorSelect(component?.params?.lastColor ?? COLOR[0][1]);
  }, [component]);
  return (
    <ExpandItemContainer>
      <Box style={{ width: "100%" }}>
        <Text>Màu bút</Text>
        <ScrollView horizontal>
          <HStack space="sm" className="p-2">
            {COLOR.map((colors, page) => (
              <HStack space="sm" key={page}>
                {colors.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => {
                      setColorSelect(color);
                      updatePaintParams({
                        lastColor: color,
                      });
                    }}
                  >
                    <Box
                      style={{ width: scale(10), height: scale(10) }}
                      className={`rounded-full shadow-md bg-white ${color === colorSelect ? "p-1" : ""}`}
                    >
                      <Box
                        style={{
                          backgroundColor: color,
                        }}
                        className="rounded-full shadow-md flex-1"
                      />
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            ))}
          </HStack>
        </ScrollView>
      </Box>
    </ExpandItemContainer>
  );
};

export default PaintColor;
