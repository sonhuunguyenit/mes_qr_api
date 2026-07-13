import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Empty, Header, Linear, Spacer } from "~/common";
import { Container } from "~/components";
import { useSheet } from "~/contexts/SheetContext";
import { useTheme } from "~/hooks/useTheme";
import { NotificationItem as NotificationItemType } from "~/services/notification/notification.type";
import { handleOpenURL } from "~/utils/deepLink";
import StringHelper from "~/utils/string";
import NotificationItem from "../components/NotificationItem";
import NotificationSearch from "../components/NotificationSearch";
import NotificationSkeleton from "../components/NotificationSkeleton";
import { useNotificationActions } from "../hooks/useNotificationActions";
import { useNotificationList } from "../hooks/useNotificationList";
import { NotificationDetailSheet } from "../sheets/NotificationDetailSheet";

const Notification = () => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const {
    data: lstNotification,
    numNotifyNew,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useNotificationList();

  const { readNotification } = useNotificationActions();
  const [search, setSearch] = useState("");

  const filteredNotifications = useMemo(() => {
    let result = lstNotification;

    if (!search) return result;
    const searchNorm = StringHelper.removeVietnameseTones(search.toLowerCase());

    return result.filter((item) => {
      const messageNorm = StringHelper.removeVietnameseTones(
        item.message.toLowerCase(),
      );
      const messageFullNorm = StringHelper.removeVietnameseTones(
        item.messageFull.toLowerCase(),
      );
      return (
        messageNorm.includes(searchNorm) || messageFullNorm.includes(searchNorm)
      );
    });
  }, [search, lstNotification]);

  const handleItemPress = useCallback(
    async (item: NotificationItemType) => {
      // Mark as read on press if it's new
      if (item.isNew) {
        try {
          await readNotification(item.id);
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
        }
      }

      // Open details bottom sheet
      openSheet(
        <NotificationDetailSheet
          item={item}
          onClose={closeSheet}
          onViewDetail={(url) => {
            closeSheet();
            handleOpenURL(url);
          }}
        />,
      );
    },
    [readNotification, openSheet, closeSheet],
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationItemType }) => (
      <NotificationItem item={item} onPress={handleItemPress} />
    ),
    [handleItemPress],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.blue1} />
      </View>
    );
  }, [isFetchingNextPage, colors.blue1]);

  return (
    <Linear>
      <Header
        title="Thông báo"
        subTitle={
          numNotifyNew > 0
            ? `Có ${numNotifyNew} thông báo mới`
            : "Thông báo gần đây"
        }
        showBack={true}
      />

      <Container style={styles.container}>
        <NotificationSearch value={search} onChangeText={setSearch} />
        <Spacer size={8} />
        {isLoading && !isRefetching ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <Empty title="Chưa có thông báo nào" />
        ) : (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </Container>
    </Linear>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: "center",
  },
  markReadButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default Notification;
