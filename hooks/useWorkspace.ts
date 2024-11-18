import { QueryKeys } from "@/constants/QueryKeys";
import { Workspace } from "@/type/store";
import { last } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const useCurrentWorkspace = () =>
  useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });

export const useCurrentFrame = () => {
  const { data: workspace } = useCurrentWorkspace();
  return last(workspace?.frames ?? []);
};

export default useCurrentWorkspace;
