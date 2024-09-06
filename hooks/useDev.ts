import { QueryKeys } from "@/constants/QueryKeys";
import queryClient from "@/services/queryClient";
import { useQuery } from "@tanstack/react-query";

export const log = (...arg) => {
  queryClient.setQueryData(
    [QueryKeys.DEV_LOG],
    (
      oldData: Array<Object | string | number>
    ): Array<Object | string | number> => [...oldData, ...arg]
  );
};

const useLogStored = () =>
  useQuery<unknown, unknown, Array<Object | string | number>>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });

export default useLogStored;
