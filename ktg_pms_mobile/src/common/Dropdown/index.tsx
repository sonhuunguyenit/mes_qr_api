import { colors } from "~/constants/colors";
import { typography } from "~/constants/typography";
import { Icon } from "@rneui/base";
import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown as RNDropdown } from "react-native-element-dropdown";
import { Text } from "../Text";

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
    const [isFocus, setIsFocus] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text label style={styles.label}>
            {label}
          </Text>
        )}

        <RNDropdown
          style={[
            styles.dropdown,
            isFocus && styles.focused,
            !editable && styles.disabled,
            errorMessage && styles.errorBorder,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
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
          activeColor="rgba(24, 144, 255, 0.1)"
          containerStyle={styles.dropdownContainer}
          renderRightIcon={() => (
            <Icon
              type="feather"
              name="chevron-down"
              size={20}
              color={editable ? "#00000073" : "#00000040"}
            />
          )}
          renderItem={(item) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
          )}
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
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
    color: colors.label,
    marginBottom: 6,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  focused: {
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.border,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  placeholderStyle: {
    ...typography.body,
    color: colors.placeholder,
  },
  selectedTextStyle: {
    ...typography.body,
    color: colors.value,
  },
  dropdownContainer: {
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    elevation: 8,
    shadowColor: colors.black,
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
    backgroundColor: colors.white,
  },
  itemText: {
    ...typography.body,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    ...typography.caption,
    marginTop: 4,
  },
});
