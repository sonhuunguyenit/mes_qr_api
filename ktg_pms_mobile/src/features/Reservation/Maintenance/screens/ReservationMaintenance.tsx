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
import ReservationMaintenanceItem from "../components/ReservationMaintenanceItem";
import ReservationMaintenanceItemSkeleton from "../components/ReservationMaintenanceItemSkeleton";
import { useReservationMaintenanceList } from "../hooks/useReservationMaintenance";
import ReservationMaintenanceFilterSheet from "../sheets/ReservationMaintenanceFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.ReservationMaintenance
>;

const ReservationMaintenanceScreen = ({ route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const { user } = useAuth();
  const moduleType = "REPAIR_DEMAND";

  const [filters, setFilters] = useState<ReservationFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    status: RESERVATION_STATUS.WAITING_APPROVAL,
    moduleType,
    companyId: user?.companyId,
  });

  const {
    data: reservationListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReservationMaintenanceList(filters);

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
    !!filters.code ||
    !!filters.order_des ||
    !!filters.order_id ||
    !!filters.orderType ||
    !!filters.equipment ||
    !!filters.createdByName ||
    !!filters.departmentName ||
    !!filters.notiDate ||
    !!filters.currentApprover ||
    (!!filters.status &&
      filters.status !== RESERVATION_STATUS.WAITING_APPROVAL);

  const filterSheetFactory = useMemo(() => {
    return () => (
      <ReservationMaintenanceFilterSheet
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
    <ReservationMaintenanceItem
      item={item}
      onPress={() => {
        closeSheet();
        goReservationDetail(item, true); // Nhu cầu sửa chữa
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

  const screenTitle = "Nhu cầu sửa chữa";

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
            renderItem={() => <ReservationMaintenanceItemSkeleton />}
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
              isFetchingNextPage ? <ReservationMaintenanceItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default ReservationMaintenanceScreen;
