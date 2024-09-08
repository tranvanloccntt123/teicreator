import { QueryKeys } from "@/constants/QueryKeys";
import queryClient from "@/services/queryClient";
import { DevLog } from "@/type/store";
import { useQuery } from "@tanstack/react-query";
import uuid from "react-native-uuid";

export const log = (...arg) => {
  const label: string = arg.map((v) => JSON.stringify(v)).join(", ");
  queryClient.setQueryData(
    [QueryKeys.DEV_LOG],
    (oldData: Array<DevLog>): Array<DevLog> => [
      ...(oldData || []),
      {
        id: uuid.v4() as string,
        label,
        data: [...arg],
        type: "Info",
      },
    ]
  );
};

export const warningLog = (...arg) => {
  const label: string = arg.map((v) => JSON.stringify(v)).join(", ");
  queryClient.setQueryData(
    [QueryKeys.DEV_LOG],
    (oldData: Array<DevLog>): Array<DevLog> => [
      ...(oldData || []),
      {
        id: uuid.v4() as string,
        label,
        data: [...arg],
        type: "Warning",
      },
    ]
  );
};

export const errorLog = (...arg) => {
  const label: string = arg.map((v) => JSON.stringify(v)).join(", ");
  queryClient.setQueryData(
    [QueryKeys.DEV_LOG],
    (oldData: Array<DevLog>): Array<DevLog> => [
      ...(oldData || []),
      {
        id: uuid.v4() as string,
        label,
        data: [...arg],
        type: "Error",
      },
    ]
  );
};

export const clearAllLog = () => {
  queryClient.setQueryData([QueryKeys.DEV_LOG], () => []);
};

const useLogStored = () =>
  useQuery<unknown, unknown, Array<DevLog>>({
    queryKey: [QueryKeys.DEV_LOG],
  });

export default useLogStored;
