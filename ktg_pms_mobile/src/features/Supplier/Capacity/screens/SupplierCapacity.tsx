import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Container, Empty, Header, Linear } from "~/common";
import globalStyle from "~/styles/global-style";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLawStatus } from "~/enums/supplier-law.enum";
import { useTheme } from "~/hooks/useTheme";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierCapacityItem as ISupplierCapacityItem,
  SupplierCapacityFilterParams,
} from "~/services/supplier/supplier-capacity.type";
import { goSupplierCapacityDetail } from "~/utils/navigate";
import SupplierCapacityItem from "../components/SupplierCapacityItem";
import SupplierCapacityItemSkeleton from "../components/SupplierCapacityItemSkeleton";
import { useSupplierCapacity } from "../hooks/useSupplierCapacity";
import SupplierCapacityFilterSheet from "../sheets/SupplierCapacityFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierCapacity
>;

const SupplierCapacity = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const { useCapacityList } = useSupplierCapacity();

  const [filters, setFilters] = useState<SupplierCapacityFilterParams>({
    pageIndex: 1,
    pageSize: 10,
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
  } = useCapacityList(filters);

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
    (newFilters: Partial<SupplierCapacityFilterParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
    },
    [],
  );

  const openFilter = useCallback(() => {
    openSheet(
      <SupplierCapacityFilterSheet
        initialFilters={filters}
        onApply={(f) => handleApplyFilter(f)}
        onClose={closeSheet}
      />,
    );
  }, [filters, handleApplyFilter, closeSheet]);

  const hasFilter =
    !!filters.supplierName ||
    !!filters.supplierCode ||
    !!filters.code ||
    (!!filters.status && filters.status !== SupplierLawStatus.WAIT_APPROVE) ||
    (!!filters.createdAt && filters.createdAt.length > 0);

  const handlePressItem = useCallback((item: ISupplierCapacityItem) => {
    goSupplierCapacityDetail(item);
  }, []);

  const displayData =
    listData?.pages?.flatMap((page) => page.data?.[0] || []) || [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <SupplierCapacityItemSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <Linear>
      <Header
        title="Nhà cung cấp"
        subTitle="Chỉnh sửa năng lực"
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
            renderItem={() => <SupplierCapacityItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={({ item }) => (
              <SupplierCapacityItem item={item} onPress={handlePressItem} />
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

export default SupplierCapacity;
