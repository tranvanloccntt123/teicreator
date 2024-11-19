import React from "react";
import { Box } from "../box";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { boxStyle } from "../box/styles";
import {
  ViewProps,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from "react-native";

export type ViewResponsiveStyle = {
  xs?: StyleProp<ViewStyle>;
  sm?: StyleProp<ViewStyle>;
  md?: StyleProp<ViewStyle>;
  lg?: StyleProp<ViewStyle>;
  xl?: StyleProp<ViewStyle>;
  "2xl"?: StyleProp<ViewStyle>;
};

type IBoxProps = ViewProps &
  VariantProps<typeof boxStyle> & {
    className?: string;
    responsive: ViewResponsiveStyle;
  };

const ViewResponsive: React.FC<IBoxProps> = ({
  style,
  responsive,
  ...props
}) => {
  /*
    xs: 480px and up
    sm: 640px and up
    md: 768px and up
    lg: 1024px and up
    xl: 1280px and up
    2xl: 1536px and up
    */
  const { width } = useWindowDimensions();
  const responsiveStyle = React.useMemo(
    () =>
      width >= 1536
        ? responsive["2xl"] ||
          responsive.xl ||
          responsive.lg ||
          responsive.md ||
          responsive.sm ||
          responsive.xs ||
          {}
        : width >= 1280
          ? responsive.xl ||
            responsive.lg ||
            responsive.md ||
            responsive.sm ||
            responsive.xs
          : width >= 1024
            ? responsive.lg || responsive.md || responsive.sm || responsive.xs
            : width >= 768
              ? responsive.md || responsive.sm || responsive.xs
              : width >= 640
                ? responsive.sm || responsive.xs
                : responsive.xs || {},
    [width]
  );
  const mergedStyles: StyleProp<ViewStyle> = [style, responsiveStyle];
  return <Box {...props} style={mergedStyles} />;
};

export default ViewResponsive;
