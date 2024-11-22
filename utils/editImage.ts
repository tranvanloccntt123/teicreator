import { QueryKeys } from "@/constants/QueryKeys";
import { INIT_MATRIX } from "@/constants/Workspace";
import queryClient from "@/services/queryClient";
import { ImageWorkspace, WorkspaceSize } from "@/type/store";
import { Skia } from "@shopify/react-native-skia";
import { makeMutable } from "react-native-reanimated";
import { fitComponentSize } from "./images";

export const setImageWorkspace = (data: ImageWorkspace) => {
  queryClient.setQueryData([QueryKeys.IMAGE_WORKSPACE], () => data);
};

export const initMatrixBackgroundImageWorkspace = async (
  uri: string,
  rootSize: WorkspaceSize
) => {
  const data = await Skia.Data.fromURI(uri);
  const _image = Skia.Image.MakeImageFromEncoded(data);
  queryClient.setQueryData(
    [QueryKeys.IMAGE_WORKSPACE],
    (oldData: ImageWorkspace): ImageWorkspace => {
      console.log("UPDATE WORKSPACE");
      return {
        ...oldData,
        components: [
          {
            data: _image,
            matrix: INIT_MATRIX.map((v) => makeMutable(v)),
            size: {
              width: _image.width(),
              height: _image.height(),
            },
          },
          ...oldData.components,
        ],
        isInit: false,
        // background: {
        //   ...oldData.background,
        //   matrix: INIT_MATRIX.map((v) => makeMutable(v)),
        // },
      };
    }
  );
  return fitComponentSize({
    imageHeight: _image.height(),
    imageWidth: _image.width(),
    widthDimensions: rootSize.width,
    heightDimensions: rootSize.height,
  });
};
