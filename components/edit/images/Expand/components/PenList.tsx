import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { PAINT_PEN_TYPE_LIST } from "@/constants/Workspace";
import { Component, PaintType } from "@/type/store";
import { useColorScheme } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { updatePaintParams } from "@/utils";
import { Button } from "@/components/ui/button";
import PenIcon from "./PenIcon";
import { Colors } from "@/constants/Colors";
import ExpandItemContainer from "./ExpandItemContainer";

const PenList: React.FC<{ component?: Component }> = ({ component }) => {
  const colorScheme = useColorScheme();
  const [pen, setPen] = React.useState<PaintType>(PaintType.PEN);
  React.useEffect(() => {
    setPen(component?.params?.lastPainType ?? PaintType.PEN);
  }, [component]);
  return (
    <ExpandItemContainer>
      <Box style={{ width: "100%" }}>
        <Text>Bút</Text>
        <HStack space="sm" className="p-2">
          {PAINT_PEN_TYPE_LIST.map((value) => (
            <Button
              variant="outline"
              key={value}
              onPress={() => {
                setPen(value);
                updatePaintParams({
                  lastPainType: value,
                });
              }}
            >
              <PenIcon
                type={value}
                color={
                  value === pen
                    ? Colors[colorScheme ?? "light"].tint
                    : Colors[colorScheme ?? "light"].icon
                }
              />
            </Button>
          ))}
        </HStack>
      </Box>
    </ExpandItemContainer>
  );
};

export default PenList;
