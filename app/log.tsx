import React from "react";
import { Box } from "@/components/ui/box";
import useLogStored from "@/hooks/useDev";

const LogData = () => {
  const logs = useLogStored();
  return <Box></Box>;
};

export default LogData;
