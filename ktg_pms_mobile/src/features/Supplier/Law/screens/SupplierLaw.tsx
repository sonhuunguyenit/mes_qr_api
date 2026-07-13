import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Container, Empty, Header, Linear } from "~/common";
import globalStyle from "~/styles/global-style";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLawStatus } from "~/enums/supplier-law.enum";
import { useTheme } from "~/hooks/useTheme";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierLawItem as ISupplierLawItem,
  SupplierLawFilterParams,
} from "~/services/supplier/supplier-law.type";
import { goSupplierLawDetail } from "~/utils/navigate";
import SupplierLawItem from "../components/SupplierLawItem";
import SupplierLawItemSkeleton from "../components/SupplierLawItemSkeleton";
import { useSupplierLaw } from "../hooks/useSupplierLaw";
import SupplierLawFilterSheet from "../sheets/SupplierLawFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLaw
>;

const SupplierLaw = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { openSheet, closeSheet } = useSheet();

  const { useLawList, useApprove, useReject } = useSupplierLaw();
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const [filters, setFilters] = useState<SupplierLawFilterParams>({
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
  } = useLawList(filters);

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
    (newFilters: Partial<SupplierLawFilterParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
    },
    [],
  );

  const filterSheetContent = useMemo(
    () => (
      <SupplierLawFilterSheet
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

  const handlePressItem = useCallback((item: ISupplierLawItem) => {
    goSupplierLawDetail(item);
  }, []);

  const displayData = listData?.pages?.flatMap((page) => page[0] || []) || [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <SupplierLawItemSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <Linear>
      <Header
        title="Nhà cung cấp"
        subTitle="Chỉnh sửa pháp lý"
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
            renderItem={() => <SupplierLawItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={({ item }) => (
              <SupplierLawItem
                item={item}
                onPress={handlePressItem}
                isLoading={
                  approveMutation.isPending || rejectMutation.isPending
                }
              />
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

export default SupplierLaw;
