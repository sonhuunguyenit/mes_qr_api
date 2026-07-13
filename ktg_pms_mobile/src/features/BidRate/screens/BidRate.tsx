import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { BID_RATE_ALLOWED_STATUSES } from "~/enums";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  BidRateFilterParams,
  BidRateItemData,
} from "~/services/bidRate/bidRate.type";
import globalStyle from "~/styles/global-style";
import { goBidDetail } from "~/utils/navigate";
import BidRateItem from "../components/BidRateItem";
import BidRateItemSkeleton from "../components/BidRateItemSkeleton";
import { useBidRateList } from "../hooks/useBidRate";
import BidRateFilterSheet from "../sheets/BidRateFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.BidRate
>;

const BidRateScreen = ({ route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const listTargetId = route.params?.listTargetId;

  const [filters, setFilters] = useState<BidRateFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    listTargetId: listTargetId,
    // sync from bid-rate.component.ts:310 — chỉ hiển thị gói thầu cần chọn NCC
    status: BID_RATE_ALLOWED_STATUSES,
  });

  const hasActiveFilter = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (
        key === "pageIndex" ||
        key === "pageSize" ||
        key === "listTargetId" ||
        key === "status"
      ) {
        return false;
      }

      if (typeof value === "string") {
        return value.trim() !== "";
      }

      if (Array.isArray(value)) {
        return value.some((v) => v !== undefined && v !== null && v !== "");
      }

      return value !== undefined && value !== null && value !== "";
    });
  }, [filters]);

  const {
    data: bidRateListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBidRateList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback((newFilters: BidRateFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const openFilterSheet = useCallback(() => {
    openSheet(
      <BidRateFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
      />,
    );
  }, [openSheet, closeSheet, filters, handleApplyFilter]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({ item }: { item: BidRateItemData }) => (
    <BidRateItem
      item={item}
      onPress={() => {
        console.log("=== NAVIGATE TO BID DETAIL ===", {
          id: item.id,
          isMemeberApproved: (item as any).isMemeberApproved,
        });
        // Web Admin uses BidDetail with rate=rate
        // sync from bid-rate.component.ts:310
        // pass isMemeberApproved because it's only available in pagination api, not detail api
        goBidDetail(item.id, true, (item as any).isMemeberApproved);
      }}
    />
  );

  const displayData =
    bidRateListData?.pages?.flatMap((page: any) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Header
        title="NCC Thắng thầu"
        subTitle="Danh sách duyệt NCC Thắng thầu"
        showBack={true}
        showSearch={true}
        searchMode="button"
        hasFilter={hasActiveFilter}
        onFilter={openFilterSheet}
        onInput={{
          value: filters.keyword,
          onChange: (text) => handleApplyFilter({ keyword: text }),
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching ? (
          <FlatList
            data={[1, 2, 3]}
            renderItem={() => <BidRateItemSkeleton />}
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
              isFetchingNextPage ? <BidRateItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default BidRateScreen;
