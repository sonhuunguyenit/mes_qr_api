import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View, StyleSheet } from "react-native";
import { Column, Input, Row, Button } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";

interface MaterialConfirmSyncSheetProps {
  initialMaterialCode?: string;
  onApprove: (code: string) => void;
  onClose: () => void;
}

export const MaterialConfirmSyncSheet = ({
  initialMaterialCode,
  onApprove,
  onClose,
}: MaterialConfirmSyncSheetProps) => {
  const { spacing, colors, radius } = useTheme();
  const { showToast } = useToast();
  const { setIsSheetLoading } = useSheet();

  const [materialCode, setMaterialCode] = useState<string>(
    initialMaterialCode || "",
  );
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

  const handleApprove = () => {
    const trimmedCode = materialCode.trim();
    if (!trimmedCode) {
      showToast({
        type: "warning",
        message: "Vui lòng nhập mã vật tư (Material Code)",
      });
      return;
    }
    onApprove(trimmedCode);
    onClose();
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet
        type="detail"
        title="Xác nhận đồng bộ"
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
            <ColumnFilter
              label="Vui lòng nhập mã vật tư (Material Code):"
              value={
                <Input
                  placeholder="Nhập mã vật tư..."
                  value={materialCode}
                  onChangeText={setMaterialCode}
                  InputComponent={BottomSheetTextInput}
                  autoFocus={true}
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
                title="Phê duyệt"
                onPress={handleApprove}
                buttonStyle={[
                  styles.primaryBtn,
                  {
                    borderRadius: radius.button,
                    backgroundColor: colors.primary,
                  },
                ]}
                titleStyle={{ color: colors.black, fontWeight: "600" }}
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

export default React.memo(MaterialConfirmSyncSheet);
