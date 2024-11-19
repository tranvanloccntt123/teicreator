import { QueryKeys } from "@/constants/QueryKeys";
import { INIT_MATRIX } from "@/constants/Workspace";
import queryClient from "@/services/queryClient";
import { ImageWorkspace } from "@/type/store";
import { makeMutable } from "react-native-reanimated";

export const setImageWorkspace = (data: ImageWorkspace) => {
  queryClient.setQueryData([QueryKeys.IMAGE_WORKSPACE], () => data);
};

export const initMatrixBackgroundImageWorkspace = () => {
  queryClient.setQueryData(
    [QueryKeys.IMAGE_WORKSPACE],
    (oldData: ImageWorkspace): ImageWorkspace => {
      return {
        ...oldData,
        background: {
          ...oldData.background,
          matrix: INIT_MATRIX.map((v) => makeMutable(v)),
        },
      };
    }
  );
};
