import React from "react";
import { Component, PaintType } from "@/type/store";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const PenIcon: React.FC<{
  type?: PaintType;
  size?: number;
  color?: string;
}> = ({ type, ...props }) => {
  return type === PaintType.PEN ? (
    <Feather name="pen-tool" size={24} color="black" {...props} />
  ) : type === PaintType.HIGH_LIGHT_PEN ? (
    <FontAwesome5 name="highlighter" size={24} color="black" {...props} />
  ) : (
    <></>
  );
};

export default PenIcon;
