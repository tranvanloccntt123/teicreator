import React from "react";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { Text as RNText, useColorScheme } from "react-native";
import { TTextProps, textStyle } from "./styles";
import { Colors } from "@/constants/Colors";

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle> &
  TTextProps;

const Text = React.forwardRef<React.ElementRef<typeof RNText>, ITextProps>(
  (
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = "md",
      sub,
      italic,
      highlight,
      schemeDisabled,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const _styles = React.useMemo(
      () => [
        { color: !schemeDisabled && Colors[colorScheme ?? "light"].text },
        props.style,
      ],
      [props.style]
    );
    return (
      <RNText
        className={textStyle({
          isTruncated,
          bold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
          class: className,
        })}
        {...props}
        style={_styles}
        ref={ref}
      />
    );
  }
);

Text.displayName = "Text";

export { Text };
