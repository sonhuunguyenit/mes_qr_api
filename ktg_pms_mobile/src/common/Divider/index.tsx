import React from "react";
import { View } from "react-native";
import { useTheme } from "~/hooks/useTheme";

type Props = {
  width?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  color?: string;
};

export const Divider = ({
  width = 1,
  top = 0,
  bottom = 0,
  left = 0,
  right = 0,
  color,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        marginTop: top,
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
        height: width,
        backgroundColor: color ?? colors.divider,
      }}
    />
  );
};
