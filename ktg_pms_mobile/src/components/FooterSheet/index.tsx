import { Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Row } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface FooterSheetProps {
  onApply: () => void;
  onReset: () => void;
  applyTitle?: string;
}

export const FooterSheet = ({
  onApply,
  onReset,
  applyTitle = "Áp dụng bộ lọc",
}: FooterSheetProps) => {
  const insets = useSafeAreaInsets();
  const { colors, radius } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        { borderTopColor: colors.border, paddingBottom: insets.bottom + 10 },
      ]}
    >
      <Row gap={10}>
        <View style={{ flex: 1 }}>
          <Button
            title={applyTitle}
            onPress={onApply}
            containerStyle={styles.applyBtnContainer}
            buttonStyle={[
              styles.applyBtn,
              { borderRadius: radius.button, backgroundColor: colors.primary },
            ]}
            titleStyle={[styles.applyBtnTitle, { color: colors.black }]}
          />
        </View>
        <TouchableOpacity
          onPress={onReset}
          style={[
            styles.resetBtn,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.button,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon
            name="refresh-cw"
            type="feather"
            size={20}
            color={colors.title}
          />
        </TouchableOpacity>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  resetBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  applyBtnContainer: {
    height: 50,
  },
  applyBtn: {
    height: 50,
  },
  applyBtnTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});
