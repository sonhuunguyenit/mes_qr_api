import { typography } from "~/constants/typography";
import { Icon } from "@rneui/base";
import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown as RNDropdown } from "react-native-element-dropdown";
import { Text } from "../Text";
import { useTheme } from "~/hooks/useTheme";

interface DropdownProps {
  label?: string;
  value: string | number | null;
  onChange: (value: string | number) => void;
  data: { label: string; value: string | number }[];
  placeholder?: string;
  errorMessage?: string;
  editable?: boolean;
  containerStyle?: object;
}

export const Dropdown = memo(
  ({
    label,
    value,
    onChange,
    data,
    placeholder = "Select",
    errorMessage,
    editable = true,
    containerStyle,
  }: DropdownProps) => {
    const { colors, radius } = useTheme();
    const [isFocus, setIsFocus] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text label style={[styles.label, { color: colors.label }]}>
            {label}
          </Text>
        )}

        <RNDropdown
          style={[
            styles.dropdown,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              borderRadius: radius.sm,
            },
            isFocus && { borderColor: colors.primary },
            !editable && {
              backgroundColor: colors.disabledBg,
              borderColor: colors.border,
            },
            errorMessage && { borderColor: colors.error },
          ]}
          placeholderStyle={[styles.placeholderStyle, { color: colors.placeholder }]}
          selectedTextStyle={[styles.selectedTextStyle, { color: colors.value }]}
          data={data}
          maxHeight={360}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            onChange(item.value);
            setIsFocus(false);
          }}
          disable={!editable}
          activeColor={colors.blueAlpha10 as string}
          containerStyle={[
            styles.dropdownContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              shadowColor: colors.black as any,
              borderRadius: radius.sm,
            },
          ]}
          renderRightIcon={() => (
            <Icon
              type="feather"
              name="chevron-down"
              size={20}
              color={
                editable
                  ? (colors.blackOpacity45 as string)
                  : (colors.blackOpacity25 as string)
              }
            />
          )}
          renderItem={(item) => (
            <View style={[styles.item, { backgroundColor: colors.card }]}>
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.label}
              </Text>
            </View>
          )}
        />

        {errorMessage && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  },
);

Dropdown.displayName = "Dropdown";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    ...typography.label,
    marginBottom: 6,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholderStyle: {},
  selectedTextStyle: {},
  dropdownContainer: {
    marginTop: 4,
    borderWidth: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: "hidden",
  },
  item: {
    height: 50,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  itemText: {
    ...typography.text,
  },
  errorText: {
    marginTop: 4,
  },
});
