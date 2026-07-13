import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { PLACEHOLDER_SEARCH_BAR } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { PR_STATUS } from "~/enums";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { PRFilterParams, PRItemData } from "~/services/pr/pr.type";
import globalStyle from "~/styles/global-style";
import { goPRDetail } from "~/utils/navigate";
import PRItem from "../components/PRItem";
import PRItemSkeleton from "../components/PRItemSkeleton";
import { usePRList } from "../hooks";
import PRFilterSheet from "../sheets/PRFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PR
>;

const PRScreen = ({ navigation, route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const listTargetId = route.params?.listTargetId;
  const moduleType = route.params?.type;

  const [filters, setFilters] = useState<PRFilterParams>({
    startDate: undefined,
    endDate: undefined,
    pageIndex: 1,
    pageSize: 10,
    listTargetId: listTargetId,
    moduleType: moduleType,
    budgetStatus: undefined,
    isParentItem: 0,
    status: PR_STATUS.WAITING_APPROVAL,
  });

  const {
    data: prListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePRList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback((newFilters: PRFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasFilter =
    !!filters.pmsNo ||
    !!filters.sapNo ||
    !!filters.externalMaterialGroupId ||
    !!filters.createdBy ||
    !!filters.purchaseGroup ||
    !!filters.uses ||
    (!!filters.status && filters.status !== PR_STATUS.WAITING_APPROVAL) ||
    (!!filters.prType && filters.prType !== undefined) ||
    (!!filters.sourceType && filters.sourceType !== undefined) ||
    (!!filters.plantId && filters.plantId !== undefined) ||
    (!!filters.budgetStatus && filters.budgetStatus !== undefined) ||
    !!filters.keyword ||
    filters.totalValueFrom !== undefined ||
    filters.totalValueTo !== undefined ||
    filters.budgetShortageFrom !== undefined ||
    filters.budgetShortageTo !== undefined;

  const filterSheetFactory = useMemo(() => {
    return () => (
      <PRFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
      />
    );
  }, [filters, handleApplyFilter, closeSheet]);

  const openFilter = useCallback(() => {
    openSheet(filterSheetFactory);
  }, [filterSheetFactory, openSheet]);

  const renderItem = ({ item }: { item: PRItemData }) => (
    <PRItem
      item={item}
      onPress={() => {
        closeSheet();
        goPRDetail(item);
      }}
    />
  );

  const displayData =
    prListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Header
        title="Duyệt PR"
        subTitle="Danh sách PR chờ duyệt"
        showBack={true}
        showSearch={true}
        searchMode="button"
        onFilter={openFilter}
        hasFilter={hasFilter}
        onInput={{
          value: filters.keyword,
          onChange: (text) => handleApplyFilter({ keyword: text }),
          placeholder: PLACEHOLDER_SEARCH_BAR,
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <PRItemSkeleton />}
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
            ListFooterComponent={isFetchingNextPage ? <PRItemSkeleton /> : null}
          />
        )}
      </Container>
    </Linear>
  );
};

export default PRScreen;
