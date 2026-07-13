import { Icon } from "@rneui/base";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Row, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface MainItemInfoProps {
  title: string | null | undefined;
  style?: StyleProp<ViewStyle>;
  numberOfLines?: number;
}

export const MainItemInfo = ({
  title,
  style,
  numberOfLines = 1,
}: MainItemInfoProps) => {
  const { colors } = useTheme();

  return (
    <Row gap={5} margin={[0, 0, 0, 5]} style={style} align="center">
      <Icon
        name={"caret-right"}
        type="font-awesome-5"
        size={22}
        color={colors.active}
      />

      <Text
        bold
        size={16}
        color={colors.title}
        numberOfLines={numberOfLines}
        style={{ flexShrink: 1 }}
      >
        {title || "---"}
      </Text>
    </Row>
  );
};
