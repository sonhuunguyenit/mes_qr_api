import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { PRFilterParams, PRItemData } from "~/services/pr/pr.type";
import { goPRDetail } from "~/utils/navigate";
import PRItem from "../components/PRItem";
import PRItemSkeleton from "../components/PRItemSkeleton";
import { usePRList } from "../hooks";
import PRFilterSheet from "../sheets/PRFilterSheet";
import { PR_STATUS } from "~/enums";
import { AppNavigatorParamList } from "~/navigation/navigation.type";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PR
>;

const PRScreen = () => {
  const insets = useSafeAreaInsets();
  const { openSheet, closeSheet } = useSheet();
  const route = useRoute<Props["route"]>();

  const isApprove = route.params?.isApprove || route.params?.isNotifyApprove;
  const listTargetId = route.params?.listTargetId;
  const moduleType = route.params?.type;

  const [filters, setFilters] = useState<PRFilterParams>({
    startDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    pageIndex: 1,
    pageSize: 20,
    listTargetId: listTargetId,
    moduleType: moduleType,
    budgetStatus: isApprove ? "ALL" : undefined,
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
    (!!filters.status && filters.status !== "ALL") ||
    (!!filters.prType && filters.prType !== "ALL") ||
    (!!filters.sourceType && filters.sourceType !== "ALL") ||
    (!!filters.plantId && filters.plantId !== "ALL");

  const openFilter = useCallback(() => {
    openSheet(
      <PRFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
        isApprove={isApprove}
      />,
    );
  }, [filters, isApprove]);

  const renderItem = ({ item }: { item: PRItemData }) => (
    <PRItem
      item={item}
      onPress={() => {
        closeSheet();
        goPRDetail(item);
      }}
      isApprove={isApprove}
    />
  );

  const displayData =
    prListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Container>
        <Header
          title="Duyệt PR"
          showBack={true}
          showSearch={true}
          searchMode="button"
          onFilter={openFilter}
          hasFilter={hasFilter}
          onInput={{
            value: filters.keyword,
            onChange: (text) => handleApplyFilter({ keyword: text }),
            placeholder: "Tìm kiếm mã PR, vật tư...",
          }}
        />

        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <PRItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            contentContainerStyle={styles.listContent}
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
              {
                paddingHorizontal: 5,
                paddingTop: 10,
                paddingBottom: insets.bottom + 100,
              },
              displayData.length === 0 && styles.emptyContainer,
            ]}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={isRefetching}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PRScreen;
