import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { BID_STATUS } from "~/enums";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import { BidFilterParams, BidItemData } from "~/services/bid/bid.type";
import globalStyle from "~/styles/global-style";
import { goBidDetail } from "~/utils/navigate";
import BidItem from "../components/BidItem";
import BidItemSkeleton from "../components/BidItemSkeleton";
import { useBidList } from "../hooks/useBid";
import BidFilterSheet from "../sheets/BidFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.Bid
>;

const BidScreen = ({ navigation, route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const listTargetId = route.params?.listTargetId;

  const [filters, setFilters] = useState<BidFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    listTargetId: listTargetId,
    status: BID_STATUS.WAITING_APPROVAL,
  });

  const {
    data: bidListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBidList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback((newFilters: BidFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasFilter =
    !!filters.code ||
    !!filters.keyword ||
    !!filters.techName ||
    !!filters.tradeName ||
    !!filters.biddingCouncil ||
    !!filters.name ||
    (!!filters.status && filters.status !== BID_STATUS.WAITING_APPROVAL) ||
    !!filters.companyId ||
    !!filters.projectId ||
    !!filters.masterBidGuaranteeId ||
    !!filters.purpose ||
    !!filters.bidTypeCode ||
    !!filters.createdAt ||
    !!filters.acceptEndDate ||
    !!filters.submitEndDate;

  const filterSheetContent = useMemo(
    () => (
      <BidFilterSheet
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

  const renderItem = ({ item }: { item: BidItemData }) => (
    <BidItem
      item={item}
      onPress={() => {
        goBidDetail(item.id);
      }}
    />
  );

  const displayData =
    bidListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Header
        title="Duyệt gói thầu"
        subTitle="Danh sách gói thầu chờ duyệt"
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
        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2, 3]}
            renderItem={() => <BidItemSkeleton />}
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
              isFetchingNextPage ? <BidItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default BidScreen;
