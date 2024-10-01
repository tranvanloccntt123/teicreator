import {
  Component,
  DraftWorkspace,
  FitSize,
  MatrixIndex,
  PaintMatrix,
  PaintParams,
  PaintType,
  Vector,
  Workspace,
  WorkspaceBase,
  WorkspaceSize,
} from "@/type/store";
import uuid from "react-native-uuid";
import { BTN_OPTION_SIZE } from "@/constants/EditImage";
import { SharedValue } from "react-native-reanimated";
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
import { SkCanvas, Skia } from "@shopify/react-native-skia";
import queryClient from "@/services/queryClient";
import { QueryKeys } from "@/constants/QueryKeys";

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

export const setCurrentWorkspace = (workspace: Workspace) => {
  queryClient.setQueryData([QueryKeys.CURRENT_WORKSPACE], (): Workspace => {
    return workspace;
  });
};

export const pushComponentToCurrentWorkspace = (component: Component) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => ({
      ...oldData,
      components: [...(oldData?.components || []), component],
      componentEditingId: component.id,
    })
  );
};

export const pushComponentToDraftWorkspace = (
  component: Component<number[]>
) => {
  queryClient.setQueryData(
    [QueryKeys.DRAFT_WORKSPACE],
    (oldData: DraftWorkspace): DraftWorkspace => ({
      ...oldData,
      components: [...(oldData?.components || []), component],
    })
  );
};

export const setDraftWorkspace = (workspace: DraftWorkspace) => {
  queryClient.setQueryData([QueryKeys.DRAFT_WORKSPACE], (): DraftWorkspace => {
    return workspace;
  });
};

export const pushWorkspace = (workspace: Workspace) => {
  queryClient.setQueryData(
    [QueryKeys.WORKSPACE_LIST],
    (oldData: Workspace[] | undefined): Workspace[] => [
      ...(oldData || []),
      workspace,
    ]
  );
};

export const setCurrentComponent = (id: string) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      return {
        ...oldData,
        componentEditingId: id,
      };
    }
  );
};

export const clearCurrentComponent = () => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      return {
        ...oldData,
        componentEditingId: undefined,
      };
    }
  );
};

export const deleteComponentById = (id: string) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => ({
      ...oldData,
      components: (oldData?.components || []).filter(
        (component) => component.id !== id
      ),
      componentEditingId:
        oldData.componentEditingId === id
          ? undefined
          : oldData.componentEditingId,
    })
  );
};

export const updateCurrentWorkspace = (params: { viewResize?: FitSize }) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const workspaceViewSize = oldData.viewResize;
      if (params?.viewResize) {
        workspaceViewSize.height.value = params.viewResize.height;
        workspaceViewSize.width.value = params.viewResize.width;
        workspaceViewSize.scale.value = params.viewResize.scale;
      }
      return {
        ...oldData,
        viewResize: workspaceViewSize,
      };
    }
  );
};

export const updatePaintStatus = (
  paintStatus: string,
  componentIndex: number,
  data: PaintMatrix
) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      components[componentIndex].data = data;
      return {
        ...oldData,
        components,
        paintStatus: paintStatus,
      };
    }
  );
};

export const updatePaintParams = (params: PaintParams) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      const componentIndex: number = components.findIndex(
        (component) => component.id === oldData.componentEditingId
      );
      components[componentIndex]["params"] = {
        ...components[componentIndex]["params"],
        ...params,
      };
      return {
        ...oldData,
        components,
        paintStatus: "CHANGE-WEIGHT",
      };
    }
  );
};
