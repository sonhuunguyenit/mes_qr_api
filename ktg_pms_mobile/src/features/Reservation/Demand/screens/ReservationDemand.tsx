import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { RESERVATION_STATUS } from "~/enums/reservation.enum";
import { useAuth } from "~/hooks/useAuth";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  ReservationFilterParams,
  ReservationItemData,
} from "~/services/reservation/reservation.type";
import globalStyle from "~/styles/global-style";
import { goReservationDetail } from "~/utils/navigate";
import ReservationDemandItem from "../components/ReservationDemandItem";
import ReservationDemandItemSkeleton from "../components/ReservationDemandItemSkeleton";
import { useReservationDemandList } from "../hooks/useReservationDemand";
import ReservationDemandFilterSheet from "../sheets/ReservationDemandFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.ReservationDemand
>;

const ReservationDemandScreen = ({ route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const { user } = useAuth();
  const moduleType = "USAGE_DEMAND";

  const [filters, setFilters] = useState<ReservationFilterParams>({
    startDate: undefined,
    endDate: undefined,
    pageIndex: 1,
    pageSize: 10,
    sourceType: undefined,
    status: RESERVATION_STATUS.WAITING_APPROVAL,
    moduleType,
    companyId: user?.companyId,
    requisitionerName: undefined,
  });

  const {
    data: reservationListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReservationDemandList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback(
    (newFilters: ReservationFilterParams) => {
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
    !!filters.reservationNo ||
    !!filters.sapCode ||
    !!filters.plantId ||
    !!filters.departmentId ||
    !!filters.requisitionerName ||
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.sourceType ||
    (!!filters.status &&
      filters.status !== RESERVATION_STATUS.WAITING_APPROVAL);

  const filterSheetFactory = useMemo(() => {
    return () => (
      <ReservationDemandFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
      />
    );
  }, [filters, handleApplyFilter, closeSheet]);

  const openFilter = useCallback(() => {
    openSheet(filterSheetFactory);
  }, [filterSheetFactory, openSheet]);

  const renderItem = ({ item }: { item: ReservationItemData }) => (
    <ReservationDemandItem
      item={item}
      onPress={() => {
        closeSheet();
        goReservationDetail(item, false); // Nhu cầu sử dụng
      }}
    />
  );

  const displayData = useMemo(() => {
    return (
      reservationListData?.pages?.flatMap((page: any) => {
        const body = page?.data || page;
        const actualData = Array.isArray(body) ? body : body?.data || [];
        return Array.isArray(actualData[0]) ? actualData[0] : [];
      }) || []
    );
  }, [reservationListData]);

  const screenTitle = "Nhu cầu sử dụng";

  return (
    <Linear>
      <Header
        title={screenTitle}
        subTitle={`Danh sách ${screenTitle.toLowerCase()}`}
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
            renderItem={() => <ReservationDemandItemSkeleton />}
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
              isFetchingNextPage ? <ReservationDemandItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default ReservationDemandScreen;
