import { Icon, IconProps } from "@rneui/base";
import React from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Platform,
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
  shadow?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
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
  shadow = true,
  contentStyle,
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
        shadow && [styles.shadow, { shadowColor: colors.black as any }],
        style,
      ]}
    >
      <View style={[{ borderRadius: radius.block, overflow: "hidden" }, contentStyle]}>
        {title && (
        <Row gap={spacing.sm} align="center" style={[, headerStyle]}>
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
  </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
