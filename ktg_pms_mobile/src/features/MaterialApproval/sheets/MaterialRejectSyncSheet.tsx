import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View, StyleSheet } from "react-native";
import { Column, Row, Button, Checkbox } from "~/common";
import { HeaderSheet, TextArea } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { MaterialRejectSyncDto } from "~/services/material/material.type";

interface MaterialRejectSyncSheetProps {
  onReject: (data: Omit<MaterialRejectSyncDto, "materialId">) => void;
  onClose: () => void;
}

export const MaterialRejectSyncSheet = ({
  onReject,
  onClose,
}: MaterialRejectSyncSheetProps) => {
  const { spacing, colors, radius } = useTheme();
  const { showToast } = useToast();
  const { setIsSheetLoading } = useSheet();

  const [reason, setReason] = useState<string>("");
  const [blocks, setBlocks] = useState({
    isWriteGenaral: false,
    isWriteSales: false,
    isWritePurchase: false,
    isWriteMRP: false,
    isWriteQM: false,
    isWriteAccounting: false,
    isWriteCosting: false,
    isWriteCoProduct: false,
    isWriteWms: false,
  });

  const [isReady, setIsReady] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setIsSheetLoading(true);
    const timer = setTimeout(() => {
      setIsReady(true);
      setIsSheetLoading(false);
    }, BOTTOM_SHEET_TIME_LOADING);

    const showL = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideL = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      clearTimeout(timer);
      setIsSheetLoading(false);
      showL.remove();
      hideL.remove();
    };
  }, []);

  const isAllSelected = Object.values(blocks).every((v) => v);

  const toggleSelectAll = () => {
    const nextVal = !isAllSelected;
    setBlocks({
      isWriteGenaral: nextVal,
      isWriteSales: nextVal,
      isWritePurchase: nextVal,
      isWriteMRP: nextVal,
      isWriteQM: nextVal,
      isWriteAccounting: nextVal,
      isWriteCosting: nextVal,
      isWriteCoProduct: nextVal,
      isWriteWms: nextVal,
    });
  };

  const handleToggleBlock = (key: keyof typeof blocks) => {
    setBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateFields = (): boolean => {
    if (!reason.trim()) {
      showToast({
        type: "warning",
        message: "Vui lòng nhập lý do từ chối đồng bộ",
      });
      return false;
    }

    const hasSelectedBlock = Object.values(blocks).some((v) => v);
    if (!hasSelectedBlock) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn ít nhất một block cần nhập lại",
      });
      return false;
    }

    return true;
  };

  const handleReject = () => {
    if (!validateFields()) return;
    onReject({
      reason: reason.trim(),
      ...blocks,
    });
    onClose();
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="detail" title="Từ chối đồng bộ" onClose={onClose} />

      {isReady && (
        <BottomSheetScrollView
          style={{
            flex: 1,
            padding: spacing.sm,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
        >
          <Column style={{ gap: spacing.sm, paddingBottom: 30 }}>
            {/* Lý do từ chối */}
            <ColumnFilter
              label="Lý do từ chối đồng bộ *"
              value={
                <TextArea
                  placeholder="Nhập lý do từ chối..."
                  value={reason}
                  onChangeText={setReason}
                  InputComponent={BottomSheetTextInput}
                  autoFocus={true}
                  inputContainerStyle={{ minHeight: 80 }}
                  inputStyle={{ minHeight: 80 }}
                />
              }
              full
              underline={false}
            />

            {/* Block select label */}
            <ColumnFilter
              label="Chọn các block cần nhập liệu lại:"
              value={
                <Column style={{ gap: 12, marginTop: 8 }}>
                  {/* Select all */}
                  <Checkbox
                    label="Chọn tất cả"
                    checked={isAllSelected}
                    onPress={toggleSelectAll}
                    textStyle={{ fontWeight: "600" }}
                    activeColor={colors.active}
                  />

                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.border,
                      marginVertical: 4,
                    }}
                  />

                  {/* 2-column grid */}
                  <Row gap={12}>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="General"
                        checked={blocks.isWriteGenaral}
                        onPress={() => handleToggleBlock("isWriteGenaral")}
                        activeColor={colors.active}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="Sales"
                        checked={blocks.isWriteSales}
                        onPress={() => handleToggleBlock("isWriteSales")}
                        activeColor={colors.active}
                      />
                    </View>
                  </Row>

                  <Row gap={12}>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="Purchase"
                        checked={blocks.isWritePurchase}
                        onPress={() => handleToggleBlock("isWritePurchase")}
                        activeColor={colors.active}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="MRP"
                        checked={blocks.isWriteMRP}
                        onPress={() => handleToggleBlock("isWriteMRP")}
                        activeColor={colors.active}
                      />
                    </View>
                  </Row>

                  <Row gap={12}>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="QM"
                        checked={blocks.isWriteQM}
                        onPress={() => handleToggleBlock("isWriteQM")}
                        activeColor={colors.active}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="Accounting"
                        checked={blocks.isWriteAccounting}
                        onPress={() => handleToggleBlock("isWriteAccounting")}
                        activeColor={colors.active}
                      />
                    </View>
                  </Row>

                  <Row gap={12}>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="Costing"
                        checked={blocks.isWriteCosting}
                        onPress={() => handleToggleBlock("isWriteCosting")}
                        activeColor={colors.active}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="Co-Product"
                        checked={blocks.isWriteCoProduct}
                        onPress={() => handleToggleBlock("isWriteCoProduct")}
                        activeColor={colors.active}
                      />
                    </View>
                  </Row>

                  <Row gap={12}>
                    <View style={{ flex: 1 }}>
                      <Checkbox
                        label="WMS"
                        checked={blocks.isWriteWms}
                        onPress={() => handleToggleBlock("isWriteWms")}
                        activeColor={colors.active}
                      />
                    </View>
                    <View style={{ flex: 1 }} />
                  </Row>
                </Column>
              }
              full
              underline={false}
              last
            />
          </Column>
        </BottomSheetScrollView>
      )}

      {isReady && (Platform.OS === "ios" || !isKeyboardVisible) && (
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Button
                title="Huỷ"
                onPress={onClose}
                buttonStyle={[
                  styles.secondaryBtn,
                  {
                    borderRadius: radius.button,
                    backgroundColor: colors.disabledBg,
                    borderWidth: 0,
                  },
                ]}
                titleStyle={{ color: colors.text, fontWeight: "600" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Từ chối"
                onPress={handleReject}
                buttonStyle={[
                  styles.primaryBtn,
                  {
                    borderRadius: radius.button,
                    backgroundColor: colors.lredBg,
                    borderColor: colors.red,
                    borderWidth: 0.5,
                  },
                ]}
                titleStyle={{ color: colors.red, fontWeight: "600" }}
              />
            </View>
          </Row>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: 24,
  },
  primaryBtn: {
    height: 50,
  },
  secondaryBtn: {
    height: 50,
    borderWidth: 1,
  },
});

export default React.memo(MaterialRejectSyncSheet);
