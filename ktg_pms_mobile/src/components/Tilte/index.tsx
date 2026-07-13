import React from "react";
import { View, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Row, Text } from "~/common";
import { sizes } from "~/constants/sizes";
import { useTheme } from "~/hooks/useTheme";

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
  const { colors } = useTheme();
  const {
    title,
    leftIcon,
    rightIcon,
    styleTitle,
    containerStyle,
    ...colorFlags
  } = props;

  const COLOR_MAP = {
    blue: colors.lblueIcon,
    green: colors.lgreenIcon,
    yellow: colors.lyellowIcon,
    red: colors.lredIcon,
    purple: colors.lpurpleIcon,
    black: colors.black,
    white: colors.white,
  };

  let color = colors.primary;

  (Object.keys(COLOR_MAP) as Array<keyof typeof COLOR_MAP>).some((key) => {
    if (colorFlags[key]) {
      color = COLOR_MAP[key] as any;
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
        {leftIcon ?? (
          <View style={[styles.bar, { backgroundColor: color as any }]} />
        )}
        <Text
          weight="700"
          style={[styles.title, { color: colors.title as string }, styleTitle]}
        >
          {title}
        </Text>
      </Row>
      {rightIcon}
    </Row>
  );
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
  },
});
