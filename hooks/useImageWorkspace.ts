import { QueryKeys } from "@/constants/QueryKeys";
import { ImageWorkspace } from "@/type/store";
import { useQuery } from "@tanstack/react-query";

const useImageWorkspace = () =>
  useQuery<unknown, unknown, ImageWorkspace>({
    queryKey: [QueryKeys.IMAGE_WORKSPACE],
  });

export default useImageWorkspace;
