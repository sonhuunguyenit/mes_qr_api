import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierNumberAprovalStatus } from "~/enums/supplier.enum";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierSapFilterParams,
  SupplierSapItem as SupplierSapItemType,
} from "~/services/supplier/supplier.type";
import globalStyle from "~/styles/global-style";
import { goSupplierSapDetail } from "~/utils/navigate";
import SupplierSapItem, {
  SupplierSapItemSkeleton,
} from "./components/SupplierSapItem";
import { useSupplierSapFilterOptions, useSupplierSapList } from "./hooks";
import SupplierSapFilterSheet from "./sheets/SupplierSapFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierSap
>;

const SupplierSap = ({ navigation, route }: Props) => {
  const { openSheet, closeSheet } = useSheet();

  const [filters, setFilters] = useState<SupplierSapFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    status: SupplierNumberAprovalStatus.PENDING,
  });

  const {
    data: sapListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSupplierSapList(filters);

  const { data: filterOptions } = useSupplierSapFilterOptions();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback(
    (newFilters: SupplierSapFilterParams) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasFilter =
    !!filters.supplierName ||
    !!filters.supplierCode ||
    !!filters.code ||
    !!filters.companyId ||
    !!filters.createdAt;

  const filterSheetContent = useMemo(
    () => (
      <SupplierSapFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
        companies={filterOptions?.companies || []}
      />
    ),
    [filters, filterOptions, handleApplyFilter, closeSheet],
  );

  const openFilter = useCallback(() => {
    openSheet(filterSheetContent);
  }, [openSheet, filterSheetContent]);

  const renderItem = ({ item }: { item: SupplierSapItemType }) => (
    <SupplierSapItem
      item={item}
      onPress={() => {
        closeSheet();
        goSupplierSapDetail(item);
      }}
    />
  );

  const displayData =
    sapListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Header
        title="Nhà cung cấp"
        subTitle="Duyệt tạo mã SAP"
        showBack={true}
        showSearch={true}
        searchMode="button"
        onFilter={openFilter}
        hasFilter={hasFilter}
        onInput={{
          value: filters.supplierName || "",
          onChange: (text) => handleApplyFilter({ supplierName: text }),
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <SupplierSapItemSkeleton />}
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
          />
        )}
      </Container>
    </Linear>
  );
};

export default SupplierSap;
