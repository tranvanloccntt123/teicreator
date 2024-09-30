import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import {
  Component,
  FitSize,
  MatrixIndex,
  PaintMatrix,
  PaintType,
  Vector,
  WorkspaceBase,
  WorkspaceSize,
} from "@/type/store";
import uuid from "react-native-uuid";
import { BTN_OPTION_SIZE } from "@/constants/EditImage";
import { SharedValue, clamp } from "react-native-reanimated";
import {
  PAINT_BLEND_MODE,
  PAINT_COLOR_POSITION,
  PAINT_PEN_TYPE,
  PAINT_START_POSITION,
  PAINT_STROKE_CAP,
  PAINT_STROKE_JOIN,
  PAINT_WEIGHT_POSITION,
  TEMPERATURE_UP,
} from "@/constants/Workspace";
import {
  AlphaType,
  ColorType,
  SkCanvas,
  SkImage,
  Skia,
} from "@shopify/react-native-skia";

export const getComponentTransform = (
  component: Component,
  transform: MatrixIndex,
  scale?: number
) => component.matrix[transform].value * (scale ?? 1);

export const updateComponentTransform = (
  component: Component,
  transform: MatrixIndex,
  value: number,
  scale?: number
) => {
  component.matrix[transform].value = value / (scale ?? 1);
};

export const componentSize = (component: Component) => {
  return {
    width:
      component.size.width *
      getComponentTransform(component, MatrixIndex.SCALE),
    height:
      component.size.height *
      getComponentTransform(component, MatrixIndex.SCALE),
  };
};

export const resizePosition = (component: Component): Vector => {
  return {
    x: componentSize(component).width / 2 + BTN_OPTION_SIZE / 2,
    y: -componentSize(component).height / 2 - BTN_OPTION_SIZE / 2,
  };
};

export const resizeComponentFitWorkspace = (
  component: Component,
  workspaceScale: SharedValue<number>
) => {
  return {
    width: component.size.width * workspaceScale.value,
    height: component.size.height * workspaceScale.value,
  };
};

export const createNewWorspace = ({
  size,
}: {
  size: WorkspaceSize;
}): WorkspaceBase => ({
  id: uuid.v4() as string,
  size,
});

export const findCurrentComponent = (
  components: Component[],
  componentId: string
) => {
  return components.find((component) => component.id === componentId);
};

export const rootTranslate = ({
  width,
  height,
  viewWidth,
  viewHeight,
}: {
  width: number;
  height: number;
  viewWidth: number;
  viewHeight: number;
}) => ({
  x: (width - viewWidth) / 2,
  y: (height - viewHeight) / 2,
});

export const temperatureUp = (matrixFilter: Array<number>, percent: number) => {
  let _matrixFilter = matrixFilter.concat();
  TEMPERATURE_UP.forEach((color, index) => {
    _matrixFilter[index] += color * percent;
  });
  return _matrixFilter;
};

export const paintLinePath = (
  component: Component,
  canvas: SkCanvas,
  options?: { scale: number; opacity: number }
) => {
  const listPath = component.data as PaintMatrix;
  const paint = Skia.Paint();
  listPath.forEach((line) => {
    const color = line[PAINT_COLOR_POSITION] as string;
    const weight = line[PAINT_WEIGHT_POSITION] as number;
    const paintType = line[PAINT_PEN_TYPE] as PaintType;
    paint.setBlendMode(PAINT_BLEND_MODE[paintType]);
    const path = Skia.Path.Make();
    paint.setColor(Skia.Color(color));
    if (options?.opacity !== undefined) {
      paint.setAlphaf(options.opacity);
    }
    if (line.length === PAINT_START_POSITION + 2) {
      const x = (line[PAINT_START_POSITION] as number) * (options?.scale ?? 1);
      const y =
        (line[PAINT_START_POSITION + 1] as number) * (options?.scale ?? 1);
      path.addCircle(x, y, (weight / 1.8) * (options?.scale ?? 1));
    } else {
      for (let i = PAINT_START_POSITION; i < line.length - 2; i += 2) {
        const x = (line[i] as number) * (options?.scale ?? 1);
        const y = (line[i + 1] as number) * (options?.scale ?? 1);
        if (i === PAINT_START_POSITION) {
          path.moveTo(x, y);
          continue;
        }
        path.lineTo(x, y);
      }
      path.stroke({
        width: weight * (options?.scale ?? 1),
        cap: PAINT_STROKE_CAP[paintType],
        join: PAINT_STROKE_JOIN[paintType],
      });
    }

    path.close();
    canvas.drawPath(path, paint);
  });
};
