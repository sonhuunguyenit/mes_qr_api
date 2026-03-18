import React from "react";
import { View, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Row, Text } from "~/common";
import { colors } from "~/constants/colors";
import { sizes } from "~/constants/sizes";

type Props = {
  blue?: boolean;
  green?: boolean;
  yellow?: boolean;
  orange?: boolean;
  red?: boolean;
  purple?: boolean;
  gray?: boolean;
  white?: boolean;
  black?: boolean;

  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  styleTitle?: TextStyle;
  containerStyle?: ViewStyle;
};

export const Title = (props: Props) => {
  const {
    title,
    leftIcon,
    rightIcon,
    styleTitle,
    containerStyle,
    ...colorFlags
  } = props;

  let color = "#007AFF";

  (Object.keys(COLOR_MAP) as Array<keyof typeof COLOR_MAP>).some((key) => {
    if (colorFlags[key]) {
      color = COLOR_MAP[key];
      return true;
    }
    return false;
  });

  return (
    <Row
      width={"100%"}
      justify="space-between"
      align="center"
      gap={10}
      style={containerStyle}
    >
      <Row full>
        {leftIcon ?? <View style={[styles.bar, { backgroundColor: color }]} />}
        <Text weight="700" style={[styles.title, styleTitle]}>
          {title}
        </Text>
      </Row>
      {rightIcon}
    </Row>
  );
};

const COLOR_MAP = {
  blue: colors.lblueIcon,
  green: colors.lgreenIcon,
  yellow: colors.lyellowIcon,
  red: colors.lredIcon,
  purple: colors.lpurpleIcon,
  black: colors.black,
  white: colors.white,
};

const styles = StyleSheet.create({
  bar: {
    width: 3,
    height: 20,
    borderRadius: 3,
  },
  title: {
    marginLeft: 10,
    fontSize: sizes.fontSize.xl,
    color: "#1C1C1E",
  },
});
