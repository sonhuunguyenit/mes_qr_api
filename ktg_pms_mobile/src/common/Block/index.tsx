import { Icon, IconProps } from "@rneui/base";
import React from "react";
import {
  ColorValue,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { Row } from "../Row";
import { Text } from "../Text";

interface BlockProps {
  title?: string;
  icon?: IconProps;
  rightSide?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  center?: boolean;
  titleColor?: ColorValue;
  titleStyle?: TextStyle;
}

export const Block = ({
  title,
  icon,
  rightSide,
  children,
  style,
  headerStyle,
  center,
  titleColor,
  titleStyle,
}: BlockProps) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.block,
          borderRadius: radius.block,
          padding: spacing.sm,
        },
        style,
      ]}
    >
      {title && (
        <Row
          gap={spacing.sm}
          align="center"
          style={[{ paddingHorizontal: spacing.sm }, headerStyle]}
        >
          {icon && <Icon size={18} color={colors.active} {...icon} />}
          <Text
            bold
            size={15}
            color={titleColor || colors.active}
            style={[{ flex: 1 }, titleStyle]}
            center={center}
          >
            {title}
          </Text>
          {rightSide && rightSide}
        </Row>
      )}

      {children}
    </View>
  );
};
