import { Button as ButtonRE, ButtonProps as ButtonREProps } from "@rneui/base";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";

export interface ButtonProps extends ButtonREProps {
  full?: boolean;
}

export const Button = ({ full, containerStyle, ...props }: ButtonProps) => {
  const { colors, fonts, radius } = useTheme();

  return (
    <ButtonRE
      {...props}
      titleStyle={[
        {
          fontSize: sizes.fontSize.base,
          color: colors.black,
        },
        props.titleStyle,
      ]}
      buttonStyle={[
        {
          height: 50,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.button,
          backgroundColor: colors.primary,
        },
        props.buttonStyle,
      ]}
      containerStyle={[
        styles.container,
        full && { width: "100%" },
        containerStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
