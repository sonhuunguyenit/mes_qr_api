import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { View, Linking, TouchableOpacity } from "react-native";
import { Column, Row, Text } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";

interface SupplierCapacityCertificationDetailSheetProps {
  item: any;
}

export const SupplierCapacityCertificationDetailSheet = ({
  item,
}: SupplierCapacityCertificationDetailSheetProps) => {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet title="Chi tiết chứng nhận" type="detail" />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tên chứng nhận" value={item?.name || "---"} full />
          
          <ColumnInfo
            label="File đính kèm"
            value={
              item?.fileAttachment ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.fileAttachment)}>
                  <Text color={colors.active} bold>Xem file</Text>
                </TouchableOpacity>
              ) : (
                "---"
              )
            }
            full
          />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>
    </View>
  );
};
