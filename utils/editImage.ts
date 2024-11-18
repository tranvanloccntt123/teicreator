import { QueryKeys } from "@/constants/QueryKeys";
import queryClient from "@/services/queryClient";
import { ImageWorkspace } from "@/type/store";

export const setImageWorkspace = (data: ImageWorkspace) => {
  queryClient.setQueryData([QueryKeys.IMAGE_WORKSPACE], () => data);
};
