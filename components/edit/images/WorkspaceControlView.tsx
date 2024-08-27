import React from "react";
import { Box } from "@/components/ui/box";
import { QueryKeys } from "@/constants/QueryKeys";
import { Workspace } from "@/type/store";
import { useQuery } from "@tanstack/react-query";
import GestureComponent from "./GestureComponent";

const WorkspaceControlView = () => {
  const { data: workspace } = useQuery<unknown, unknown, Workspace>({
    queryKey: [QueryKeys.CURRENT_WORKSPACE],
  });
  return (
    <Box
      style={{
        width: workspace?.size?.width || 1,
        height: workspace?.size?.height || 1,
      }}
    >
      {(workspace?.components || []).map((component) => (
        <GestureComponent component={component} key={component.id} />
      ))}
    </Box>
  );
};

export default WorkspaceControlView;
