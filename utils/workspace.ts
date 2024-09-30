import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import {
  Component,
  FitSize,
  MatrixIndex,
  Vector,
  WorkspaceBase,
  WorkspaceSize,
} from "@/type/store";
import uuid from "react-native-uuid";
import { BTN_OPTION_SIZE } from "@/constants/EditImage";
import { SharedValue, clamp } from "react-native-reanimated";
import { TEMPERATURE_UP } from "@/constants/Workspace";
import { AlphaType, ColorType, SkImage } from "@shopify/react-native-skia";

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
