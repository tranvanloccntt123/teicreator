import React from "react";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { TTextProps, textStyle } from "./styles";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

type ITextProps = React.ComponentProps<"span"> &
  VariantProps<typeof textStyle> &
  TTextProps;

const Text = React.forwardRef<React.ElementRef<"span">, ITextProps>(
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
    }: { className?: string } & ITextProps,
    ref
  ) => {
    const colorScheme = useColorScheme();
    const _styles = React.useMemo(
      () => ({
        color: !schemeDisabled && Colors[colorScheme ?? "light"].text,
        ...props.style,
      }),
      [props.style]
    );
    return (
      <span
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
