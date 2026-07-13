import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "@rneui/base";
import { Card, Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { NotificationItem as NotificationItemType } from "~/services/notification/notification.type";

interface NotificationItemProps {
  item: NotificationItemType;
  onPress: (item: NotificationItemType) => void;
}

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const { colors } = useTheme();

  // Extract sender name matching the web logic: "Anh/Chị [NAME] vừa thực hiện..."
  const extractSenderName = (messageFull: string): string => {
    if (!messageFull) return "Hệ thống";
    const senderMatch = messageFull.match(
      /Anh\/Chị\s+([^<\s]+(?:\s+[^<\s]+)?)\s+vừa/,
    );
    if (senderMatch && senderMatch[1]) {
      return senderMatch[1].trim();
    }
    return "Hệ thống";
  };

  // Strip HTML tags for clean display of the message description on mobile
  const cleanMessageText = (html: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
  };

  const sender = extractSenderName(item.messageFull);
  const cleanDesc = cleanMessageText(item.messageFull);

  return (
    <Card
      shadow={false}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.divider,
        },
      ]}
      onPress={() => onPress(item)}
    >
      <Row align="center" style={styles.row}>
        {/* Unread indicator dot */}
        <View style={styles.indicatorContainer}>
          {item.isNew && (
            <View
              style={[styles.indicator, { backgroundColor: colors.active }]}
            />
          )}
        </View>

        {/* Bell Icon */}
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: item.isNew
                ? `${String(colors.active)}15`
                : colors.gray100,
            },
          ]}
        >
          <Icon
            name="bell"
            type="feather"
            size={20}
            color={item.isNew ? colors.active : colors.label}
          />
        </View>

        <Spacer size={12} horizontal />

        {/* Content details */}
        <View style={styles.textContainer}>
          <Row justify="space-between" align="center">
            <Text bold size={13} color={colors.label} numberOfLines={1}>
              {sender}
            </Text>
            <Text size={11} color={colors.label}>
              {moment(item.createdAt).format("DD/MM/YYYY • HH:mm")}
            </Text>
          </Row>

          <Spacer size={4} />

          <Text
            bold={item.isNew}
            size={13}
            color={colors.title}
            numberOfLines={2}
          >
            {item.message}
          </Text>

          {cleanDesc ? (
            <>
              <Spacer size={4} />
              <Text size={12} color={colors.label} numberOfLines={2}>
                {cleanDesc}
              </Text>
            </>
          ) : null}
        </View>
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
  },
  row: {
    paddingRight: 8,
  },
  indicatorContainer: {
    width: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
});

export default NotificationItem;
