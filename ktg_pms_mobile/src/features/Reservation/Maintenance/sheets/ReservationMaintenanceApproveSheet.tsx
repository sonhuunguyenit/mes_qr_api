import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View, StyleSheet } from "react-native";
import { Column, Input, Row, SelectPicker, Button } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { MAINTENANCE_NOTIFICATION_TYPES } from "~/enums/reservation.enum";

interface Props {
  initialOrderType?: string;
  initialSettleOrder?: string;
  initialTextActivities?: string;
  onApprove: (data: {
    orderType: string;
    settle_order?: string;
    textActivities: string;
    comment?: string;
  }) => void;
  onApproveAndSync: (data: {
    orderType: string;
    settle_order?: string;
    textActivities: string;
    comment?: string;
  }) => void;
  onClose: () => void;
}

const ReservationMaintenanceApproveSheet = ({
  initialOrderType,
  initialSettleOrder,
  initialTextActivities,
  onApprove,
  onApproveAndSync,
  onClose,
}: Props) => {
  const { spacing, colors, radius } = useTheme();
  const { showToast } = useToast();
  const { setIsSheetLoading } = useSheet();

  const [orderType, setOrderType] = useState<string>(initialOrderType || "");
  const [settleOrder, setSettleOrder] = useState<string>(
    initialSettleOrder || "",
  );
  const [textActivities, setTextActivities] = useState<string>(
    initialTextActivities || "",
  );
  const [comment, setComment] = useState<string>("");

  const [isReady, setIsReady] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Check if it is vehicle order (X1 to X9 are vehicle orders, check type === 'xe')
  const selectedTypeObj = MAINTENANCE_NOTIFICATION_TYPES.find(
    (x) => x.value === orderType,
  );
  const isVehicleOrder = selectedTypeObj?.type === "xe";

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

  const validateFields = (): boolean => {
    if (!orderType) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn Loại order",
      });
      return false;
    }
    if (!textActivities.trim()) {
      showToast({
        type: "warning",
        message: "Vui lòng nhập thông tin Xử lý",
      });
      return false;
    }
    if (isVehicleOrder && !settleOrder.trim()) {
      showToast({
        type: "warning",
        message: "Vui lòng nhập IO/Settle Order cho loại đơn hàng xe",
      });
      return false;
    }
    return true;
  };

  const handleApprove = () => {
    if (!validateFields()) return;
    onApprove({
      orderType,
      settle_order: isVehicleOrder ? settleOrder : undefined,
      textActivities,
      comment: comment.trim() || undefined,
    });
    onClose();
  };

  const handleApproveAndSync = () => {
    if (!validateFields()) return;
    onApproveAndSync({
      orderType,
      settle_order: isVehicleOrder ? settleOrder : undefined,
      textActivities,
      comment: comment.trim() || undefined,
    });
    onClose();
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet
        type="detail"
        title="Thông tin phê duyệt"
        onClose={onClose}
      />

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
            {/* 1. Loại order (Dropdown) */}
            <ColumnFilter
              label="Loại order *"
              value={
                <SelectPicker
                  listSelection={MAINTENANCE_NOTIFICATION_TYPES}
                  value={orderType}
                  onSelect={(item: Record<string, any>) => {
                    setOrderType(item.value);
                    // Clear settleOrder if changing to non-vehicle type
                    if (item.type !== "xe") {
                      setSettleOrder("");
                    }
                  }}
                  placeholder="Chọn loại order"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            />

            {/* 2. Settle Order (IO) - Only visible for vehicle orders */}
            {isVehicleOrder && (
              <ColumnFilter
                label="Settle Order (IO) *"
                value={
                  <Input
                    placeholder="Nhập Settle Order (IO)"
                    value={settleOrder}
                    onChangeText={setSettleOrder}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                full
                underline={false}
              />
            )}

            {/* 3. Xử lý (Text activities) */}
            <ColumnFilter
              label="Xử lý (Các bước hoạt động) *"
              value={
                <Input
                  placeholder="Nhập nội dung xử lý..."
                  value={textActivities}
                  onChangeText={setTextActivities}
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* 4. Ý kiến duyệt (Optional approval comment) */}
            <ColumnFilter
              label="Ý kiến duyệt (Không bắt buộc)"
              value={
                <Input
                  placeholder="Nhập ý kiến hoặc ghi chú..."
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={2}
                  style={styles.commentArea}
                  InputComponent={BottomSheetTextInput}
                />
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
                title="Chỉ duyệt"
                onPress={handleApprove}
                buttonStyle={[
                  styles.secondaryBtn,
                  { borderRadius: radius.button, borderColor: colors.border },
                ]}
                titleStyle={{ color: colors.title }}
                type="outline"
              />
            </View>
            <View style={{ flex: 1.2 }}>
              <Button
                title="Duyệt & Đồng bộ"
                onPress={handleApproveAndSync}
                buttonStyle={[
                  styles.primaryBtn,
                  {
                    borderRadius: radius.button,
                    backgroundColor: colors.active,
                  },
                ]}
                titleStyle={{ color: colors.white }}
              />
            </View>
          </Row>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  commentArea: {
    minHeight: 60,
    textAlignVertical: "top",
    paddingTop: 8,
  },
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

export default React.memo(ReservationMaintenanceApproveSheet);
