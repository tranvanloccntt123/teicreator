import {
  EditComponent,
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
  FrameComponent,
  ImageComponent,
} from "@/type/store";
import uuid from "react-native-uuid";
import { BTN_OPTION_SIZE } from "@/constants/EditImage";
import { SharedValue, makeMutable } from "react-native-reanimated";
import {
  INIT_MATRIX,
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
  component: EditComponent | FrameComponent | ImageComponent,
  transform: MatrixIndex,
  scale?: number
) => {
  "worklet";
  return component.matrix[transform].value * (scale ?? 1);
};

export const updateComponentTransform = (
  component: EditComponent,
  transform: MatrixIndex,
  value: number,
  scale?: number
) => {
  component.matrix[transform].value = value / (scale ?? 1);
};

export const componentSize = (component: EditComponent) => {
  return {
    width:
      component.size.width *
      getComponentTransform(component, MatrixIndex.SCALE),
    height:
      component.size.height *
      getComponentTransform(component, MatrixIndex.SCALE),
  };
};

export const resizePosition = (component: EditComponent): Vector => {
  return {
    x: componentSize(component).width / 2 + BTN_OPTION_SIZE / 2,
    y: -componentSize(component).height / 2 - BTN_OPTION_SIZE / 2,
  };
};

export const resizeComponentFitWorkspace = (
  component: EditComponent | FrameComponent | ImageComponent,
  workspaceScale: SharedValue<number>
) => {
  "worklet";
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
  components: EditComponent[],
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
}) => {
  "worklet";
  return {
    x: (width - viewWidth) / 2,
    y: (height - viewHeight) / 2,
  };
};

export const temperatureUp = (matrixFilter: number[], percent: number) => {
  "worklet";
  let _matrixFilter = matrixFilter.concat();
  TEMPERATURE_UP.forEach((color, index) => {
    _matrixFilter[index] += color * percent;
  });
  return _matrixFilter;
};

export const paintLinePath = (
  component: EditComponent,
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

export const pushComponentToCurrentWorkspace = (component: EditComponent) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      if (oldData.frameId) {
        const frames = (oldData.frames ?? []).map((frame) => {
          if (frame.id === oldData.frameId) {
            return {
              ...frame,
              components: (frame.components ?? []).concat(component),
            };
          }
          return frame;
        });
        return {
          ...oldData,
          componentEditingId: component.id,
          frames,
        };
      } else {
        const rootFrameId = uuid.v4() as string;
        const initFrame: Array<FrameComponent> = [
          {
            id: rootFrameId,
            name: "Root",
            components: [component],
            size: {
              width: oldData.size.width,
              height: oldData.size.height,
            },
            matrix: INIT_MATRIX.map((v) => makeMutable(v)),
          },
        ];
        return {
          ...oldData,
          frames: (oldData.frames ?? []).concat(initFrame),
          componentEditingId: component.id,
        };
      }
    }
  );
};

export const pushComponentToDraftWorkspace = (
  component: EditComponent<number[]>
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
        components: (oldData.components ?? []).filter((component) => {
          if (component.type === "PAINT") {
            return (component.data as PaintMatrix).length > 0;
          }
          return true;
        }),
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

export const startLinePaint = (
  color: string,
  weight: number,
  penType: PaintType,
  x: number,
  y: number
) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      const componentIndex: number = components.findIndex(
        (component) => component.id === oldData.componentEditingId
      );
      (components[componentIndex].data as PaintMatrix)?.push([
        color,
        weight,
        penType,
        x,
        y,
      ]);
      return {
        ...oldData,
        components,
        paintStatus: `MOVE-TO-${x}-${y}`,
      };
    }
  );
};

export const updateLastXYLinePaint = (newX: number, newY: number) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      const componentIndex: number = components.findIndex(
        (component) => component.id === oldData.componentEditingId
      );
      const length = (components[componentIndex].data as PaintMatrix).length;
      const lineLength = (components[componentIndex].data as PaintMatrix)[
        length - 1
      ].length;
      (components[componentIndex].data as PaintMatrix)[length - 1][
        lineLength - 2
      ] = newX;
      (components[componentIndex].data as PaintMatrix)[length - 1][
        lineLength - 1
      ] = newY;
      return {
        ...oldData,
        components,
        paintStatus: `UPDATE-LINE-${newX}-${newY}`,
      };
    }
  );
};

export const moveToLinePaint = (x: number, y: number) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      const componentIndex: number = components.findIndex(
        (component) => component.id === oldData.componentEditingId
      );
      const length = (components[componentIndex].data as PaintMatrix).length;
      (components[componentIndex].data as PaintMatrix)[length - 1].push(x, y);
      return {
        ...oldData,
        components,
        paintStatus: `LINE-TO-${x}-${y}`,
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

export const workspaceScaleUp = () => {};

export const paintComponentRevert = () => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = (oldData?.components || []).concat();
      const componentIndex: number = components.findIndex(
        (component) => component.id === oldData.componentEditingId
      );
      const length = (components[componentIndex].data as PaintMatrix).length;
      if (length === 1) {
        components[componentIndex].data = [];
      } else {
        (components[componentIndex].data as PaintMatrix)?.pop();
      }
      return {
        ...oldData,
        components,
        paintStatus: "REVERT-" + length,
      };
    }
  );
};
