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

export default useCurrentWorkspace;
