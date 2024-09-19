import { QueryKeys } from "@/constants/QueryKeys";
import { Component, DraftWorkspace, Workspace } from "@/type/store";
import { QueryClient, useQuery } from "@tanstack/react-query";

const useCurrentWorkspace = () =>
  useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });

export const setCurrentWorkspace = (
  workspace: Workspace,
  queryClient: QueryClient
) => {
  queryClient.setQueryData([QueryKeys.CURRENT_WORKSPACE], (): Workspace => {
    return workspace;
  });
};

export const pushComponentToCurrentWorkspace = (
  component: Component,
  queryClient: QueryClient
) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => ({
      ...oldData,
      components: [...(oldData?.components || []), component],
    })
  );
};

export const pushComponentToDraftWorkspace = (
  component: Component<number>,
  queryClient: QueryClient
) => {
  queryClient.setQueryData(
    [QueryKeys.DRAFT_WORKSPACE],
    (oldData: DraftWorkspace): DraftWorkspace => ({
      ...oldData,
      components: [...(oldData?.components || []), component],
    })
  );
};

export const setDraftWorkspace = (
  workspace: DraftWorkspace,
  queryClient: QueryClient
) => {
  queryClient.setQueryData([QueryKeys.DRAFT_WORKSPACE], (): DraftWorkspace => {
    return workspace;
  });
};

export const pushWorkspace = (
  workspace: Workspace,
  queryClient: QueryClient
) => {
  queryClient.setQueryData(
    [QueryKeys.WORKSPACE_LIST],
    (oldData: Workspace[] | undefined): Workspace[] => [
      ...(oldData || []),
      workspace,
    ]
  );
};

export const setCurrentComponent = (id: string, queryClient: QueryClient) => {
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

export const clearCurrentComponent = (queryClient: QueryClient) => {
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

export const deleteComponentById = (id: string, queryClient: QueryClient) => {
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

export const updateCurrentWorkspace = (
  id: string,
  params: { blur?: number; lightUpPercent?: number },
  queryClient: QueryClient
) => {
  queryClient.setQueryData(
    [QueryKeys.CURRENT_WORKSPACE],
    (oldData: Workspace): Workspace => {
      const components = oldData?.components || [];
      for (const index in components) {
        if (components[index].id === id) {
          components[index].blur.value =
            params.blur !== undefined
              ? params.blur
              : components[index].blur.value;
          components[index].lightUpPercent.value =
            params.lightUpPercent !== undefined
              ? params.lightUpPercent
              : components[index].lightUpPercent.value;
          break;
        }
      }
      return {
        ...oldData,
        components,
        componentEditingId: id,
      };
    }
  );
};

export default useCurrentWorkspace;
