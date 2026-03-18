import Input from "~/common/Input";
import { MODAL_WIDTH, SCREEN_HEIGHT } from "~/constants";
import { useModal } from "~/hooks/useModal";
import { Icon } from "@rneui/base";
import React, { memo, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, FlatList, ViewStyle } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "../Text";
import { useTheme } from "~/hooks/useTheme";
import { sizes } from "~/constants/sizes";

type TData = Record<string, any>[];

type Props = {
  listSelection: Record<string, any>[];
  onSelect?: (item: Record<string, any>) => void;
  labelKeys?: string[];
  valueKey?: string;
  label?: string;
  placeholder?: string;
  confirm?: boolean;
  disabled?: boolean;
  search?: boolean;
  value?: any;
  containerStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  errorMessage?: string;
};

type DropSelectPickerProps = {
  listSelection: TData;
  valueKey: string;
  labelKeys: string[];
  hide: () => void;
  confirm?: boolean;
  search?: boolean;
  initialValue?: any;
  onSelect?: (item: Record<string, any>) => void;
};

const DropSelectPicker = ({
  listSelection,
  valueKey,
  labelKeys,
  hide,
  confirm = false,
  search = true,
  initialValue,
  onSelect,
}: DropSelectPickerProps) => {
  const { colors, spacing, fonts } = useTheme();
  const [tempValue, setTempValue] = useState<any>(initialValue ?? null);
  const [localFilter, setLocalFilter] = useState("");

  const data = useMemo<TData>(() => {
    return (listSelection || []).map((item) => ({
      ...item,
      label: labelKeys
        .map((k) => item[k] ?? "")
        .filter(Boolean)
        .join(" - "),
    }));
  }, [listSelection, labelKeys]);

  const filteredData = useMemo(() => {
    const query = localFilter.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => item.label?.toLowerCase().includes(query));
  }, [data, localFilter]);

  const handleSelect = (item: any) => {
    setTempValue(item[valueKey]);
    if (!confirm) {
      onSelect?.(item);
      hide();
    }
  };

  const handleConfirm = () => {
    const selected = listSelection.find((item) => item[valueKey] === tempValue);
    if (selected) {
      onSelect?.(selected);
    }
    hide();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      {search && (
        <Input
          placeholder="Search..."
          onChangeText={setLocalFilter}
          value={localFilter}
          autoFocus
          leftIcon={
            <Icon
              name="search"
              type="feather"
              size={19}
              color={colors.placeholder}
            />
          }
          rightIcon={
            localFilter ? (
              <TouchableOpacity onPress={() => setLocalFilter("")}>
                <Icon
                  name="close-circle-outline"
                  type="ionicon"
                  size={18}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) =>
          item[valueKey]?.toString() || index.toString()
        }
        style={{ marginTop: spacing.sm }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <Text
            center
            style={{
              color: colors.placeholder,
              padding: spacing.lg,
            }}
          >
            No results found
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{
              backgroundColor:
                tempValue === item[valueKey] ? colors.surface : colors.card,
              padding: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              color={
                tempValue === item[valueKey] ? colors.primary : colors.text
              }
              style={{ flex: 1, marginRight: spacing.sm }}
            >
              {item.label}
            </Text>
            {tempValue === item[valueKey] && (
              <Icon
                name="check"
                type="feather"
                size={20}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        )}
      />

      {confirm && (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, marginTop: spacing.md },
          ]}
          onPress={handleConfirm}
        >
          <Text weight="bold" color={colors.white}>
            Confirm
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const SelectPicker = memo(
  ({
    listSelection,
    labelKeys = ["name"],
    valueKey = "id",
    onSelect,
    label,
    placeholder = "Select an option",
    confirm = false,
    disabled = false,
    search = true,
    value = undefined,
    containerStyle,
    dropdownStyle,
    errorMessage,
  }: Props) => {
    const { colors, radius, spacing, fonts } = useTheme();
    const { show, hide } = useModal();
    const [internalValue, setInternalValue] = useState<any>(null);
    const selectedValue = value !== undefined ? value : internalValue;

    // Sync internal state with prop
    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const selectedItem = useMemo(() => {
      return (listSelection || []).find(
        (item) =>
          item[valueKey] ===
          (selectedValue === undefined ? null : selectedValue),
      );
    }, [listSelection, selectedValue, valueKey]);

    const selectedLabel = useMemo(() => {
      if (!selectedItem) return "";
      return labelKeys
        .map((k) => selectedItem[k] ?? "")
        .filter(Boolean)
        .join(" - ");
    }, [selectedItem, labelKeys]);

    const handleShow = () => {
      show({
        overlay: true,
        type: "modal",
        title: label,
        style: { height: SCREEN_HEIGHT * 0.5, width: MODAL_WIDTH },
        component: (
          <DropSelectPicker
            listSelection={listSelection}
            valueKey={valueKey}
            labelKeys={labelKeys}
            hide={hide}
            confirm={confirm}
            search={search}
            initialValue={selectedValue}
            onSelect={(item) => {
              if (value === undefined) {
                setInternalValue(item[valueKey]);
              }
              onSelect?.(item);
            }}
          />
        ),
      });
    };

    return (
      <View
        style={[
          styles.container,
          disabled && styles.disabledContainer,
          containerStyle,
        ]}
      >
        {label && (
          <Text
            label
            weight="500"
            color={colors.label}
            style={{
              marginBottom: 8,
            }}
          >
            {label}
          </Text>
        )}
        <TouchableOpacity onPress={handleShow} disabled={disabled}>
          <View
            style={[
              styles.dropdown,
              {
                borderColor: errorMessage ? colors.error : colors.border,
                borderRadius: radius.input,
                backgroundColor: colors.card,
                paddingHorizontal: spacing.md,
              },
              dropdownStyle,
            ]}
          >
            <Text
              style={{
                color: selectedLabel ? colors.value : colors.placeholder,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {selectedLabel || placeholder}
            </Text>
            {selectedLabel && !disabled ? (
              <TouchableOpacity
                onPress={() => {
                  if (value === undefined) {
                    setInternalValue(null);
                  }
                  onSelect?.({});
                }}
                style={{ padding: spacing.xs }}
              >
                <Icon
                  type="ionicon"
                  name="close-circle-outline"
                  size={18}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            ) : (
              <Icon
                type="feather"
                name="chevron-down"
                size={20}
                color={selectedLabel ? colors.text : colors.placeholder}
              />
            )}
          </View>
        </TouchableOpacity>
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

SelectPicker.displayName = "SelectPicker";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
