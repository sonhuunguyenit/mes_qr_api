import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { goSupplierPotentialDetail } from "~/utils/navigate";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import globalStyle from "~/styles/global-style";
import {
  SupplierPotentialItem,
  SupplierPotentialItemSkeleton,
} from "./components";
import { useSupplierPotentialList } from "./hooks";
import SupplierPotentialFilterSheet from "./sheets/SupplierPotentialFilterSheet";
import { SupplierPotentialFilterParams } from "~/services/supplier/supplier.type";
import { useSheet } from "~/contexts/SheetContext"; // Corrected import

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierPotential
>;

const SupplierPotential = ({ route }: Props) => {
  const { openSheet, closeSheet } = useSheet(); // Corrected usage

  const [filters, setFilters] = useState<SupplierPotentialFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    status: "PENDING",
  });

  const {
    data: listData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSupplierPotentialList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({ item }: { item: any }) => (
    <SupplierPotentialItem
      item={item}
      onPress={() => goSupplierPotentialDetail(item)}
    />
  );

  const displayData =
    listData?.pages?.flatMap((page: any) => {
      const body = page.data;
      if (Array.isArray(body)) return body[0] || [];
      return body?.data || [];
    }) || [];

  const hasFilter = useMemo(() => {
    const defaultKeys = ["pageIndex", "pageSize", "status"];
    return Object.keys(filters).some(
      (key) =>
        !defaultKeys.includes(key) &&
        !!filters[key as keyof SupplierPotentialFilterParams],
    );
  }, [filters]);

  const filterSheetContent = useMemo(
    () => (
      <SupplierPotentialFilterSheet
        initialFilters={filters}
        onApply={(newFilters) => {
          setFilters({ ...newFilters, pageIndex: 1 });
        }}
        onClose={closeSheet}
      />
    ),
    [filters, closeSheet],
  );

  const onOpenFilter = useCallback(() => {
    openSheet(filterSheetContent);
  }, [openSheet, filterSheetContent]);

  return (
    <Linear>
      <Header
        title="Nhà cung cấp"
        subTitle="Duyệt nhà cung cấp"
        showBack={true}
        showSearch={true}
        searchMode="button"
        onFilter={onOpenFilter} // Corrected prop name
        hasFilter={hasFilter}
        onInput={{
          value: filters.supplierName || filters.name || "",
          onChange: (text) =>
            setFilters((prev) => ({
              ...prev,
              name: text,
              supplierName: text,
              pageIndex: 1,
            })),
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <SupplierPotentialItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            contentContainerStyle={[
              displayData.length === 0 && globalStyle.emptyContainer,
            ]}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            ListEmptyComponent={<Empty />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? <SupplierPotentialItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default SupplierPotential;
