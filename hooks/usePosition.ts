import { Vector } from "@/type/store";
import { makeMutable } from "react-native-reanimated";

const usePositionXY = (data: Vector) => {
  return {
    x: makeMutable(data.x),
    y: makeMutable(data.y),
  };
};

export default usePositionXY;
