import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { debounce } from "lodash";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@rneui/themed";
import { Text } from "../Text";
import { BOTTOM_SHEET_HEIGHT } from "~/constants";
import { useTheme } from "~/hooks/useTheme";

export type SelectOption = {
  label: string;
  value: any;
  search?: string;
};

type Props = {
  options: SelectOption[];
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiSelect?: boolean;
  disabled?: boolean;
  height?: string;
};

export type SelectSheetHandle = {
  open: () => void;
  close: () => void;
};

export const SelectSheet = memo(
  forwardRef<SelectSheetHandle, Props>(
    (
      {
        options = [],
        value,
        onChange,
        placeholder = "Chọn một mục",
        searchPlaceholder = "Tìm kiếm...",
        multiSelect = false,
        disabled = false,
        height = "60%",
      },
      ref,
    ) => {
      const { colors, spacing, radius, fonts } = useTheme();
      const sheetRef = useRef<BottomSheetModal>(null);
      const [search, setSearch] = useState("");

      useImperativeHandle(ref, () => ({
        open: () => sheetRef.current?.present(),
        close: () => sheetRef.current?.dismiss(),
      }));

      const normalize = (s: string) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");

      const filtered = useMemo(() => {
        if (!search) return options;
        const q = normalize(search);
        return options.filter(
          (o) =>
            normalize(o.label).includes(q) ||
            (o.search && normalize(o.search).includes(q)),
        );
      }, [options, search]);

      const debouncedSearch = useMemo(
        () => debounce((text: string) => setSearch(text), 150),
        [],
      );
      useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

      const handleSelect = (item: SelectOption) => {
        if (multiSelect) {
          const arr = Array.isArray(value) ? value : [];
          const newVal = arr.includes(item.value)
            ? arr.filter((v: any) => v !== item.value)
            : [...arr, item.value];
          onChange(newVal);
        } else {
          onChange(item.value);
          sheetRef.current?.dismiss();
        }
      };

      const isSelected = (itemValue: any) => {
        return multiSelect
          ? Array.isArray(value) && value.includes(itemValue)
          : value === itemValue;
      };

      const getDisplayLabel = () => {
        if (multiSelect && Array.isArray(value) && value.length > 0) {
          return `${value.length} mục đã chọn`;
        }
        const selectedOption = options.find((o) => o.value === value);
        return selectedOption?.label || placeholder;
      };

      const renderItem = useCallback(
        ({ item }: { item: SelectOption }) => {
          const checked = isSelected(item.value);
          return (
            <TouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: colors.divider },
                checked && { backgroundColor: colors.surface },
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text
                weight={checked ? "600" : "400"}
                color={checked ? colors.primary : colors.text}
              >
                {item.label}
              </Text>
              {multiSelect && (
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: colors.border },
                    checked && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {checked && (
                    <Text weight="bold" color={colors.white}>
                      ✓
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        },
        [value, multiSelect, colors, fonts],
      );

      const renderBackdrop = useCallback(
        (props: any) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            pressBehavior="close"
          />
        ),
        [],
      );

      return (
        <>
          <TouchableOpacity
            disabled={disabled}
            onPress={() => sheetRef.current?.present()}
            style={[
              styles.trigger,
              {
                borderColor: colors.border,
                borderRadius: radius.input,
                backgroundColor: colors.card,
                paddingHorizontal: spacing.sm,
              },
              disabled && styles.disabled,
            ]}
          >
            <Text
              weight="400"
              color={value ? colors.text : colors.placeholder}
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {getDisplayLabel()}
            </Text>
            <Icon
              name="chevron-down"
              type="feather"
              size={20}
              color={colors.placeholder}
            />
          </TouchableOpacity>

          <BottomSheetModal
            ref={sheetRef}
            snapPoints={[BOTTOM_SHEET_HEIGHT]}
            enablePanDownToClose
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: colors.card }}
            handleIndicatorStyle={{ backgroundColor: colors.border }}
          >
            <BottomSheetView style={{ flex: 1 }}>
              <Animated.View entering={FadeIn} style={{ flex: 1 }}>
                {options.length > 5 && (
                  <View
                    style={[
                      styles.searchContainer,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <BottomSheetTextInput
                      style={[
                        styles.searchInput,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          borderRadius: radius.input,
                          color: colors.text,
                          fontFamily: fonts.regular,
                        },
                      ]}
                      placeholder={searchPlaceholder}
                      onChangeText={debouncedSearch}
                      placeholderTextColor={colors.placeholder}
                    />
                  </View>
                )}

                <BottomSheetFlatList
                  data={filtered}
                  renderItem={renderItem}
                  keyExtractor={(item: SelectOption) => item.value.toString()}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      center
                      style={{
                        marginTop: spacing.xl,
                        color: colors.placeholder,
                      }}
                    >
                      Không tìm thấy
                    </Text>
                  }
                />
              </Animated.View>
            </BottomSheetView>
          </BottomSheetModal>
        </>
      );
    },
  ),
);

SelectSheet.displayName = "SelectSheet";

const styles = StyleSheet.create({
  trigger: {
    height: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabled: {
    opacity: 0.6,
  },
  item: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    padding: 12,
  },
  searchInput: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
