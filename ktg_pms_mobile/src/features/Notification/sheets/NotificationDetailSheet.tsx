import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import moment from "moment";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Column } from "~/common";
import { HeaderSheet } from "~/components";
import { ColumnInfo } from "~/components/ColumnInfo";
import { useTheme } from "~/hooks/useTheme";
import { useAuth } from "~/hooks/useAuth";
import { NotificationItem } from "~/services/notification/notification.type";

interface NotificationDetailSheetProps {
  item: NotificationItem;
  onClose: () => void;
  onViewDetail: (url: string) => void;
}

export const NotificationDetailSheet = ({
  item,
  onClose,
  onViewDetail,
}: NotificationDetailSheetProps) => {
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const extractSenderName = (messageFull: string): string => {
    if (!messageFull) return "Hệ thống Quản trị mua hàng";
    const senderMatch = messageFull.match(
      /Anh\/Chị\s+([^<\s]+(?:\s+[^<\s]+)?)\s+vừa/,
    );
    if (senderMatch && senderMatch[1]) {
      return senderMatch[1].trim();
    }
    return "Hệ thống Quản trị mua hàng";
  };

  const cleanMessageText = (html: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
  };

  const extractIdFromUrl = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/[?&]id=([^&]+)/);
    let id = match ? match[1] : null;

    if (!id) {
      try {
        const cleanUrl = url.startsWith("ktgpms://")
          ? url.replace("ktgpms://", "https://localhost/")
          : url;
        const urlObj = new URL(cleanUrl);
        const parts = urlObj.pathname.split("/");
        const lastSegment = parts[parts.length - 1];
        if (lastSegment && lastSegment.length > 5) {
          id = lastSegment;
        }
      } catch (e) {
        const parts = url.split("?")[0].split("/");
        const lastSegment = parts[parts.length - 1];
        if (lastSegment && lastSegment.length > 5) {
          id = lastSegment;
        }
      }
    }

    if (id) {
      const lower = id.toLowerCase();
      if (
        lower === "detail" ||
        lower === "pr" ||
        lower === "po" ||
        lower === "contract" ||
        lower === "bid"
      ) {
        return null;
      }
    }

    return id;
  };

  const isLinkable = (url: string): boolean => {
    if (!url) return false;
    const id = extractIdFromUrl(url);
    if (!id) return false;

    return (
      url.includes("/pr/") ||
      url.includes("/po/") ||
      url.includes("/contract/") ||
      url.includes("/bid/") ||
      url.includes("supplier-potential") ||
      url.includes("supplier-official-upgrade") ||
      url.includes("supplier-sap") ||
      url.includes("supplier-law")
    );
  };

  const sender = extractSenderName(item.messageFull);
  const recipient = user?.name || "Bạn";
  const desc = cleanMessageText(item.messageFull);

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet
        type="detail"
        title="Chi tiết thông báo"
        iconName="bell"
        iconType="feather"
        onClose={onClose}
      />
      <BottomSheetScrollView style={{ flex: 1, padding: spacing.sm }}>
        <Column gap={12} align="stretch" padding={[10, 0]}>
          <ColumnInfo label="Tiêu đề" value={item.message || "---"} full />

          <ColumnInfo label="Từ" value={sender} full />

          <ColumnInfo label="Đến" value={recipient} full />

          <ColumnInfo
            label="Thời gian"
            value={moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
            full
          />

          <ColumnInfo label="Nội dung" value={desc || "---"} full last={true} />

          <View style={{ height: 40 }} />
        </Column>
      </BottomSheetScrollView>

      {isLinkable(item.url) ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <Button
            titleStyle={{
              fontSize: 14,
              fontWeight: "600",
            }}
            title="Đi đến"
            full
            onPress={() => onViewDetail(item.url)}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
