import { Row } from "../Row";
import { Text } from "../Text";
import { TextProps } from "~/common/Text";
import { Icon } from "@rneui/base";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import { useTheme } from "~/hooks/useTheme";

type Props = {
  label: string;
  labelColor?: string;
  value: string | React.ReactNode;
  valueColor?: string;
  labelStyle?: TextProps & TextStyle;
  valueStyle?: TextProps & TextStyle;
  onPress?: () => void;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
  limitLabelLength?: number;
  limitValueLength?: number;
  icon?: {
    name: string;
    type?: string;
    size?: number;
    color?: string;
  };
};

const InfoRow = ({
  label,
  labelColor,
  value,
  valueColor,
  labelStyle = {
    bold: true,
  },
  valueStyle = {
    bold: true,
  },
  onPress,
  isLast,
  style,
  editable = false,
  limitLabelLength,
  limitValueLength,
  icon,
}: Props) => {
  const { colors, spacing } = useTheme();

  const finalLabelColor = labelColor ?? colors.label;
  const finalValueColor = valueColor ?? colors.text;

  const renderLabel = () => {
    let displayLabel = label;
    if (limitLabelLength && label.length > limitLabelLength) {
      displayLabel = label.substring(0, limitLabelLength) + "...";
    }

    return (
      <Row
        align="center"
        gap={spacing.sm}
        style={{ flex: limitLabelLength ? 1 : undefined }}
      >
        {icon && (
          <Icon
            name={icon.name}
            type={icon.type || "material-community"}
            size={icon.size || 18}
            color={icon.color || finalLabelColor}
          />
        )}
        <Text
          label
          color={finalLabelColor}
          numberOfLines={1}
          {...labelStyle}
          style={[labelStyle?.style]}
        >
          {displayLabel}
        </Text>
      </Row>
    );
  };

  const renderValue = () => {
    if (React.isValidElement(value)) return value;

    let displayValue = String(value ?? "");
    if (limitValueLength && displayValue.length > limitValueLength) {
      displayValue = displayValue.substring(0, limitValueLength) + "...";
    }

    return (
      <Text
        value
        bold
        color={finalValueColor}
        numberOfLines={1}
        {...valueStyle}
      >
        {displayValue}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.container,
        {
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
        },
        isLast && styles.noBorder,
        style,
      ]}
    >
      {renderLabel()}

      <Row gap={spacing.sm} align="center">
        {renderValue()}
        {editable && (
          <Icon name="chevron-right" size={20} color={colors.inactive} />
        )}
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
});

export default InfoRow;
