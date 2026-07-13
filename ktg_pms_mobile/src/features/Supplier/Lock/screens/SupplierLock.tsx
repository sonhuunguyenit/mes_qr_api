import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Container, Empty, Header, Linear } from "~/common";
import globalStyle from "~/styles/global-style";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLawStatus } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierLockItem as ISupplierLockItem,
  SupplierLockFilterParams,
} from "~/services/supplier/supplier-lock.type";
import { goSupplierLockDetail } from "~/utils/navigate";
import SupplierLockItem from "../components/SupplierLockItem";
import SupplierLockItemSkeleton from "../components/SupplierLockItemSkeleton";
import { useSupplierLock } from "../hooks/useSupplierLock";
import SupplierLockFilterSheet from "../sheets/SupplierLockFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLock
>;

const SupplierLock = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const { useLockList } = useSupplierLock();

  const [filters, setFilters] = useState<SupplierLockFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    type: route.params?.type as any,
    status: SupplierLawStatus.WAIT_APPROVE,
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

  const filterSheetContent = useMemo(
    () => (
      <SupplierLockFilterSheet
        initialFilters={filters}
        onApply={(f) => handleApplyFilter(f)}
        onClose={closeSheet}
      />
    ),
    [filters, handleApplyFilter, closeSheet],
  );

  const openFilter = useCallback(() => {
    openSheet(filterSheetContent);
  }, [openSheet, filterSheetContent]);

  const hasFilter =
    !!filters.supplierName ||
    !!filters.taxCode ||
    !!filters.code ||
    (!!filters.status && filters.status !== SupplierLawStatus.WAIT_APPROVE) ||
    (!!filters.createdAt && filters.createdAt.length > 0);

  const handlePressItem = useCallback((item: ISupplierLockItem) => {
    goSupplierLockDetail(item);
  }, []);

  const displayData =
    listData?.pages?.flatMap((page) => page.data?.[0] || []) || [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <SupplierLockItemSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <Linear>
      <Header
        title="Nhà cung cấp"
        subTitle="Khoá/Mở nhà cung cấp"
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
            renderItem={() => <SupplierLockItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={({ item }) => (
              <SupplierLockItem item={item} onPress={handlePressItem} />
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

export default SupplierLock;
