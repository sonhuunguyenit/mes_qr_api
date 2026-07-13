import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Container, Empty, Header, Linear } from "~/common";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLawStatus } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierLockItem as ISupplierLockItem,
  SupplierLockFilterParams,
} from "~/services/supplier/supplier-lock.type";
import { goSupplierLockServiceDetail } from "~/utils/navigate";
import SupplierLockServiceItem from "../components/SupplierLockServiceItem";
import SupplierLockServiceItemSkeleton from "../components/SupplierLockServiceItemSkeleton";
import { useSupplierLockService } from "../hooks/useSupplierLockService";
import SupplierLockServiceFilterSheet from "../sheets/SupplierLockServiceFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLockService
>;

const SupplierLockService = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const { useLockList } = useSupplierLockService();

  const [filters, setFilters] = useState<SupplierLockFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    type: "LSS",
    status: SupplierLawStatus.WAIT_APPROVE,
    listTargetId: route.params?.listTargetId,
  });

  const {
    data: listData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLockList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleApplyFilter = useCallback(
    (newFilters: Partial<SupplierLockFilterParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
    },
    [],
  );

  const openFilter = useCallback(() => {
    openSheet(
      <SupplierLockServiceFilterSheet
        initialFilters={filters}
        onApply={(f) => handleApplyFilter(f)}
        onClose={closeSheet}
      />,
    );
  }, [filters, handleApplyFilter, closeSheet]);

  const hasFilter =
    !!filters.supplierName ||
    !!filters.taxCode ||
    !!filters.code ||
    (!!filters.status && filters.status !== SupplierLawStatus.WAIT_APPROVE) ||
    (!!filters.createdAt && filters.createdAt.length > 0);

  const handlePressItem = useCallback((item: ISupplierLockItem) => {
    goSupplierLockServiceDetail(item);
  }, []);

  const displayData =
    listData?.pages?.flatMap((page) => page.data?.[0] || []) || [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <SupplierLockServiceItemSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <Linear>
      <Header
        title="Lĩnh vực kinh doanh"
        subTitle="Khoá/Mở lĩnh vực kinh doanh"
        showBack
        showSearch
        searchMode="button"
        onFilter={openFilter}
        hasFilter={hasFilter}
        onInput={{
          value: filters.supplierName || "",
          onChange: (text) => handleApplyFilter({ supplierName: text }),
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching && displayData.length === 0 ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <SupplierLockServiceItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={({ item }) => (
              <SupplierLockServiceItem item={item} onPress={handlePressItem} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              displayData.length === 0 && { flex: 1, justifyContent: "center" },
            ]}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Empty />}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Container>
    </Linear>
  );
};

export default SupplierLockService;
