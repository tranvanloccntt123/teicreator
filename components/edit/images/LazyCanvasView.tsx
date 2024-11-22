import React from "react";
import { Canvas, Rect } from "@shopify/react-native-skia";
import { Box } from "@/components/ui/box";
import { FitSize, ImageComponent } from "@/type/store";
import Image from "./Image";
import { SharedValue } from "react-native-reanimated";

const LazyCanvasView: React.FC<{
  duration?: number;
  rootSize: FitSize<SharedValue<number>>;
  components: ImageComponent[];
}> = ({ duration, rootSize, components }) => {
  const [sleep, setSleep] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!sleep) {
      setTimeout(() => {
        setSleep(true);
      }, duration ?? 100);
    }
  }, [duration, sleep]);
  if (!sleep) {
    return <Box className="flex-1" />;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      {components.map((v, i) => (
        <Image key={`image-${i}`} component={v} rootSize={rootSize} />
      ))}
    </Canvas>
  );
};

export default LazyCanvasView;
