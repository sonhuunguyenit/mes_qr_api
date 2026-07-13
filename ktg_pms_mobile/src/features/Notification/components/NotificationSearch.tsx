import { Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Spacer } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface NotificationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const NotificationSearch = ({
  value,
  onChangeText,
  placeholder = "Tìm kiếm thông báo...",
}: NotificationSearchProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.searchBarWrapper}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon type="feather" name="search" size={18} color={colors.label} />
        <Spacer horizontal size={12} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.label}
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.input,
            {
              color: colors.title,
            },
          ]}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Icon type="feather" name="x" size={16} color={colors.label} />
          </TouchableOpacity>
        ) : (
          <View style={styles.filterIcon}>
            <Icon
              type="feather"
              name="sliders"
              size={16}
              color={colors.active}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    width: "100%",
    alignItems: "center",
    paddingTop: 3,
  },
  searchBar: {
    width: "100%",
    height: 50,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  filterIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificationSearch;
