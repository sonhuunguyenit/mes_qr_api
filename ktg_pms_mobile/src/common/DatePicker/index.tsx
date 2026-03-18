import { useTheme } from "~/hooks/useTheme";
import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text } from "../Text";
import { sizes } from "~/constants/sizes";
import moment from "moment";

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  errorMessage?: string;
  editable?: boolean;
  containerStyle?: object;
}

export const DatePicker = memo(
  ({
    label,
    value,
    onChange,
    errorMessage,
    editable = true,
    containerStyle,
  }: DatePickerProps) => {
    const { colors, fonts, spacing, isDark, radius } = useTheme();
    const [show, setShow] = useState(false);

    const handlePress = () => {
      if (editable) setShow(true);
    };

    const handleConfirm = (date: Date) => {
      setShow(false);
      onChange(date);
    };

    const handleCancel = () => {
      setShow(false);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            label
            style={{
              fontFamily: fonts.medium,
              color: colors.label,
              fontSize: sizes.fontSize.base,
              marginBottom: 8,
            }}
          >
            {label}
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={editable ? 0.7 : 1}
          style={[
            styles.inputContainer,
            {
              height: 50,
              borderColor: errorMessage ? colors.error : colors.border,
              backgroundColor: colors.card,
              borderRadius: radius.input || 8,
              paddingHorizontal: spacing.md,
            },
            !editable && { backgroundColor: colors.disabledBg },
          ]}
          onPress={handlePress}
        >
          <Text
            style={[
              {
                color: value ? colors.value : colors.placeholder,
                fontFamily: fonts.regular,
              },
              !editable && { color: colors.placeholder },
            ]}
          >
            {value ? moment(value).format("DD/MM/YYYY") : "Chọn ngày"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={show}
          mode="date"
          date={value || new Date()}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isDarkModeEnabled={isDark}
        />

        {errorMessage && (
          <Text
            size={sizes.fontSize.base}
            color={colors.error}
            style={{ marginTop: spacing.xs }}
          >
            {errorMessage}
          </Text>
        )}
      </View>
    );
  },
);

DatePicker.displayName = "DatePicker";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    borderWidth: 1,
    justifyContent: "center",
  },
});
