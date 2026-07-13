import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Collapse, Column, Row, Spacer, Text } from "~/common";
import { TextArea } from "~/components";
import { useTheme } from "~/hooks/useTheme";

interface SupplierSelectionProps {
  lstBidSupplier: any[];
  checkedSuppliers: any[];
  isMultiSupplier: boolean;
  toggleSupplier: (supplier: any) => void;
  comment: string;
  setComment: (text: string) => void;
}

const scoreRankABCD = (value?: number): string => {
  if (value === undefined || value === null || value === -1) return "-";
  // Round to max 2 decimal places (e.g. 80.199999 -> 80.2, 91.3000001 -> 91.3)
  return String(Math.round(value * 100) / 100);
};

export const StepSupplierSelection = ({
  lstBidSupplier,
  checkedSuppliers,
  isMultiSupplier,
  toggleSupplier,
  comment,
  setComment,
}: SupplierSelectionProps) => {
  const { colors } = useTheme();

  return (
    <Collapse
      title="Danh sách nhà cung cấp"
      defaultExpanded={true}
      containerStyle={{
        paddingBottom: 0,
      }}
      headerStyle={{
        borderBottomWidth: 0.75,
        borderColor: colors.border,
      }}
    >
      <Column gap={10} align="stretch" style={{ paddingHorizontal: 5 }}>
        {lstBidSupplier.map((supplier: any, index: number) => {
          if (!supplier) return null;
          const isChecked = isMultiSupplier
            ? checkedSuppliers.some((s) => s.supplierId === supplier.supplierId)
            : true; // single NCC: luôn highlight là selected
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={isMultiSupplier ? 0.7 : 1}
              onPress={
                isMultiSupplier ? () => toggleSupplier(supplier) : undefined
              }
              style={[
                styles.supplierCard,
                {
                  borderColor: isChecked
                    ? (colors.active as string)
                    : (colors.border as string),
                  backgroundColor: isChecked
                    ? (colors.lblueBg as string)
                    : (colors.card as string),
                },
              ]}
            >
              <Row align="center" gap={8}>
                {isMultiSupplier && (
                  <View style={{ width: 30 }}>
                    <Checkbox
                      checked={isChecked}
                      onPress={() => toggleSupplier(supplier)}
                      sizeVariant="sm"
                      activeColor={colors.active}
                    />
                  </View>
                )}
                <Column gap={4} align="flex-start" style={{ flex: 1 }}>
                  <Text style={[styles.supplierName, { color: colors.black }]}>
                    {supplier?.supplierName || supplier?.supplierCode || "---"}
                  </Text>

                  {/* Điểm hệ thống — sync from bid-evaluation.component.html:29-41 */}
                  <Text label bold>
                    Điểm hệ thống
                  </Text>
                  <Row gap={6} style={{ flexWrap: "wrap" }}>
                    {[
                      { label: "Tổng", val: supplier?.scoreTotal },
                      { label: "KT", val: supplier?.scoreTech },
                      { label: "BG", val: supplier?.scorePrice },
                      { label: "ĐKTM", val: supplier?.scoreTrade },
                    ].map((s) => (
                      <View
                        key={s.label}
                        style={[
                          styles.scoreChip,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scoreChipLabel,
                            { color: colors.label },
                          ]}
                        >
                          {s.label}
                        </Text>
                        <Text
                          style={[
                            styles.scoreChipVal,
                            { color: colors.active },
                          ]}
                        >
                          {scoreRankABCD(s.val)}
                        </Text>
                      </View>
                    ))}
                  </Row>

                  {/* Điểm HĐXT — sync from bid-evaluation.component.html:37-40 */}
                  <Text label bold>
                    Điểm HĐXT
                  </Text>
                  <Row gap={6} style={{ flexWrap: "wrap" }}>
                    {[
                      { label: "Tổng", val: supplier?.avgScoreTotal },
                      {
                        label: "KT",
                        val: supplier?.avgScoreManualTech,
                      },
                      {
                        label: "BG",
                        val: supplier?.avgScoreManualPrice,
                      },
                      {
                        label: "ĐKTM",
                        val: supplier?.avgScoreManualTrade,
                      },
                    ].map((s) => (
                      <View
                        key={s.label}
                        style={[
                          styles.scoreChip,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scoreChipLabel,
                            { color: colors.label },
                          ]}
                        >
                          {s.label}
                        </Text>
                        <Text
                          style={[styles.scoreChipVal, { color: colors.text }]}
                        >
                          {scoreRankABCD(s.val)}
                        </Text>
                      </View>
                    ))}
                  </Row>
                </Column>
              </Row>
            </TouchableOpacity>
          );
        })}

        <Spacer size={4} />

        {/* Ghi chú — sync from bid-evaluation.component.html:91-98 */}
        <TextArea
          label="Ghi chú"
          value={comment}
          onChangeText={setComment}
          placeholder="Nhập ghi chú (nếu có)..."
          numberOfLines={3}
        />
      </Column>
    </Collapse>
  );
};

const styles = StyleSheet.create({
  supplierCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "500",
  },
  scoreChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 56,
  },
  scoreChipLabel: {
    fontSize: 11,
  },
  scoreChipVal: {
    fontSize: 13,
    fontWeight: "600",
  },
});
