import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { PO_STATUS } from "~/enums/po.enum";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { POFilterParams, POItemData } from "~/services/po/po.type";
import globalStyle from "~/styles/global-style";
import { goPODetail } from "~/utils/navigate";
import POItem from "../components/POItem";
import POItemSkeleton from "../components/POItemSkeleton";
import { usePOList } from "../hooks";
import POFilterSheet from "../sheets/POFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PO
>;

const PO = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { openSheet, closeSheet } = useSheet();

  const initialParams = route?.params as any;
  // Logic Parity: Default status is WAITING_APPROVAL like in Angular po.component.ts
  const [filters, setFilters] = useState<POFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    status: PO_STATUS.WAITING_APPROVAL,
    budgetStatus: undefined,
    referenceSourceType: undefined,
    companyId: undefined,
    moduleType: initialParams?.type,
    listTargetId: initialParams?.listTargetId
      ? [initialParams.listTargetId]
      : undefined,
  });

  const {
    data: poListData,
    isLoading,
    refetch,
    isFetching,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePOList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback((newFilters: POFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const goToDetail = (item: POItemData) => {
    goPODetail(item);
  };

  const renderItem = ({ item }: { item: POItemData }) => (
    <POItem item={item} onPress={() => goToDetail(item)} />
  );

  const filterSheetContent = useMemo(
    () => (
      <POFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
      />
    ),
    [filters, handleApplyFilter, closeSheet],
  );

  const openFilter = useCallback(() => {
    openSheet(filterSheetContent);
  }, [openSheet, filterSheetContent]);

  const hasFilter =
    (!!filters.status && filters.status !== PO_STATUS.WAITING_APPROVAL) ||
    (!!filters.budgetStatus && filters.budgetStatus !== undefined) ||
    (!!filters.referenceSourceType &&
      filters.referenceSourceType !== undefined) ||
    !!filters.companyId ||
    !!filters.code ||
    !!filters.codeSap ||
    !!filters.supplierName ||
    !!filters.employeeName ||
    !!filters.currencyCode ||
    !!filters.referenceSourceNumbers ||
    !!filters.keyword;

  const displayData =
    poListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  const isInitialLoading = isLoading && !isRefetching;

  return (
    <Linear>
      <Header
        title={"Duyệt PO"}
        subTitle="Danh sách PO chờ duyệt"
        showBack={true}
        showSearch={true}
        searchMode="button"
        onFilter={openFilter}
        hasFilter={hasFilter}
        onInput={{
          value: filters.keyword,
          onChange: (text) => handleApplyFilter({ keyword: text }),
        }}
      />
      <Container disableInsetBottom={false}>
        {isInitialLoading ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <POItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            contentContainerStyle={[
              displayData.length === 0 && globalStyle.emptyContainer,
            ]}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              !isFetching ? <Empty title="Không có dữ liệu!" /> : null
            }
            ListFooterComponent={isFetchingNextPage ? <POItemSkeleton /> : null}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Container>
    </Linear>
  );
};

export default PO;
