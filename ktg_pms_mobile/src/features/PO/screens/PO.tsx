import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { PO_STATUS } from "~/enums/po.enum";
import { POFilterParams, POItemData } from "~/services/po/po.type";
import { goPODetail } from "~/utils/navigate";
import POItem from "../components/POItem";
import POItemSkeleton from "../components/POItemSkeleton";
import { usePOList } from "../hooks";
import POFilterSheet from "../sheets/POFilterSheet";
import { AppNavigatorParamList } from "~/navigation/navigation.type";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.PO
>;

const PO = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { openSheet, closeSheet } = useSheet();

  const initialParams = route?.params as any;
  const isNotifyApprove =
    initialParams?.isApprove || initialParams?.isNotifyApprove;

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

  // Sync with route params (e.g. when clicking a notification while the screen is open)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      pageIndex: 1,
      status: isNotifyApprove ? PO_STATUS.WAITING_APPROVAL : prev.status,
      moduleType: initialParams?.type,
      listTargetId: initialParams?.listTargetId
        ? [initialParams.listTargetId]
        : undefined,
    }));
  }, [isNotifyApprove, initialParams?.listTargetId, initialParams?.type]);

  const { data, isLoading, refetch, isFetching } = usePOList(
    filters,
    isNotifyApprove,
  );

  const handleApplyFilter = useCallback((newFilters: POFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const handleRefresh = useCallback(() => {
    setFilters((prev) => ({ ...prev, pageIndex: 1 }));
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.total && !isFetching) {
      setFilters((prev) => ({
        ...prev,
        pageIndex: (prev.pageIndex || 1) + 1,
      }));
    }
  }, [data, isFetching]);

  const goToDetail = (item: POItemData) => {
    goPODetail(item);
  };

  const renderItem = ({ item }: { item: POItemData }) => (
    <POItem
      item={item}
      onPress={() => goToDetail(item)}
      isApprove={isNotifyApprove}
    />
  );

  const openFilter = useCallback(() => {
    openSheet(
      <POFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
        isApprove={isNotifyApprove}
      />,
    );
  }, [filters, isNotifyApprove, handleApplyFilter, closeSheet, openSheet]);

  const hasFilter =
    !!filters.status ||
    !!filters.budgetStatus ||
    !!filters.referenceSourceType ||
    !!filters.companyId ||
    !!filters.code ||
    !!filters.codeSap ||
    !!filters.supplierName ||
    !!filters.employeeName ||
    !!filters.currencyCode ||
    !!filters.referenceSourceNumbers;

  const isInitialLoading = isLoading && (filters.pageIndex ?? 1) === 1;

  return (
    <Linear>
      <Container style={[styles.container, { marginTop: insets.top }]}>
        <Header
          title={"Duyệt PO"}
          showBack
          searchMode="button"
          onFilter={openFilter}
          hasFilter={hasFilter}
          onInput={{
            value: filters.keyword,
            onChange: (text) => handleApplyFilter({ keyword: text }),
            placeholder: "Tìm kiếm mã PO, nhà cung cấp...",
          }}
        />
        {isInitialLoading ? (
          <FlatList
            data={[1, 2]}
            renderItem={() => <POItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={data?.data || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            contentContainerStyle={[
              {
                paddingHorizontal: 5,
                paddingTop: 10,
                paddingBottom: insets.bottom + 100,
              },
            ]}
            onRefresh={handleRefresh}
            refreshing={isFetching && (filters.pageIndex ?? 1) === 1}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              !isFetching ? <Empty title="Không có dữ liệu!" /> : null
            }
            ListFooterComponent={
              isFetching && (filters.pageIndex ?? 1) > 1 ? (
                <POItemSkeleton />
              ) : null
            }
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
    paddingTop: 0,
  },
});

export default PO;
