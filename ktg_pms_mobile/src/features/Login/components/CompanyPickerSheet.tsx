import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

export type CompanyPickerSheetHandle = {
  open: () => void;
  close: () => void;
};

type Props = {
  listCompany: { id: string; name: string; code?: string }[];
  onSelect: (companyId: string) => void;
  onCancel?: () => void;
};

export const CompanyPickerSheet = forwardRef<CompanyPickerSheetHandle, Props>(
  ({ listCompany, onSelect, onCancel }, ref) => {
    const { colors, spacing, radius, fonts } = useTheme();
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
    }));

    const handleDismiss = useCallback(() => {
      onCancel?.();
    }, [onCancel]);

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

    const renderItem = useCallback(
      ({ item }: { item: { id: string; name: string; code?: string } }) => {
        return (
          <TouchableOpacity
            style={[
              styles.item,
              { borderBottomColor: colors.divider },
            ]}
            onPress={() => {
              onSelect(item.id);
              sheetRef.current?.dismiss();
            }}
          >
            <Text
              weight="500"
              color={colors.text}
              numberOfLines={2}
            >
              {item.code ? `${item.code} - ` : ""}{item.name}
            </Text>
          </TouchableOpacity>
        );
      },
      [colors, onSelect],
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["40%"]}
        enablePanDownToClose
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text weight="bold" size={18} color={colors.text}>
              Chọn công ty
            </Text>
          </View>
          <BottomSheetFlatList
            data={listCompany}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

CompanyPickerSheet.displayName = "CompanyPickerSheet";

const styles = StyleSheet.create({
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
