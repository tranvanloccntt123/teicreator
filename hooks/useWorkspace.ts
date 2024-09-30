import { QueryKeys } from "@/constants/QueryKeys";
import queryClient from "@/services/queryClient";
import {
  Component,
  DraftWorkspace,
  FitSize,
  PaintMatrix,
  PaintParams,
  Workspace,
} from "@/type/store";
import { useQuery } from "@tanstack/react-query";

const useCurrentWorkspace = () =>
  useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });

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

export default useCurrentWorkspace;
