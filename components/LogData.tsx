import React from "react";
import useLogStored, { clearAllLog } from "@/hooks/useDev";
import { Text } from "./ui/text";
import { Pressable, ScrollView } from "react-native";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { LogType } from "@/type/store";
import AntDesign from "@expo/vector-icons/AntDesign";

const LogTypeColor: Record<LogType, string> = {
  Error: "text-red-700",
  Warning: "text-orange-700",
  Info: "text-gray-700",
};

const LogData = () => {
  const { data } = useLogStored();
  return (
    <Box className="flex-1 bg-white">
      <HStack className="px-4 py-2">
        <Box className="flex-1" />
        <Pressable onPress={() => clearAllLog()}>
          <AntDesign name="delete" size={18} color="black" />
        </Pressable>
      </HStack>
      <ScrollView className="flex-1">
        {data?.map((value, key) => {
          return (
            <Box key={`log-${key}`} className="mb-2 p-2">
              <Pressable>
                <HStack>
                  <Text
                    className={`text-xs font-bold mr-4 ${LogTypeColor[value.type]}`}
                  >
                    {value.type}
                  </Text>
                  <Text className="flex-1 text-xs">{value.label}</Text>
                </HStack>
              </Pressable>
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
};

export default LogData;
