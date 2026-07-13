import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Container, Empty, Header, Linear } from "~/common";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";
import { ContractStatus } from "~/enums/contract.enum";
import { useTheme } from "~/hooks/useTheme";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  ContractFilterParams,
  ContractItemDto,
} from "~/services/contract/contract.type";
import { goContractDetail } from "~/utils/navigate";
import ContractItem from "../components/ContractItem";
import ContractItemSkeleton from "../components/ContractItemSkeleton";
import { useContract } from "../hooks/useContract";
import ContractFilterSheet from "../sheets/ContractFilterSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.Contract
>;

const Contract = ({ navigation, route }: Props) => {
  const { openSheet, closeSheet } = useSheet();

  const { useContractList, useApprove, useReject } = useContract();
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const [filters, setFilters] = useState<ContractFilterParams>({
    pageIndex: 1,
    pageSize: 10,
    status: ContractStatus.WAIT_APPROVE,
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
  } = useContractList(filters);

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
    (newFilters: Partial<ContractFilterParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
    },
    [],
  );

  const filterSheetContent = useMemo(
    () => (
      <ContractFilterSheet
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
    !!filters.contractNumber ||
    !!filters.sapCode ||
    !!filters.name ||
    (!!filters.contractType && filters.contractType !== "ALL") ||
    !!filters.companyCode ||
    !!filters.effectiveDateStart ||
    !!filters.effectiveDateEnd ||
    !!filters.expiredDateStart ||
    !!filters.expiredDateEnd ||
    !!filters.createdDateStart ||
    !!filters.createdDateEnd;

  const handlePressItem = useCallback(
    (item: ContractItemDto) => {
      goContractDetail({
        item,
        onGoBack: () => {
          refetch();
        },
      });
    },
    [refetch],
  );

  const displayData = listData?.pages?.flatMap((page) => page[0] || []) || [];

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <ContractItemSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <Linear>
      <Header
        title="Duyệt hợp đồng"
        subTitle="Danh sách phê duyệt hợp đồng"
        showBack
        showSearch
        searchMode="button"
        onFilter={openFilter}
        hasFilter={hasFilter}
        onInput={{
          value: filters.contractNumber || "",
          onChange: (text) => handleApplyFilter({ contractNumber: text }),
        }}
      />

      <Container disableInsetBottom={false}>
        {isLoading && !isRefetching && displayData.length === 0 ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <ContractItemSkeleton />}
            keyExtractor={(item) => `skeleton-${item}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={displayData}
            renderItem={({ item }) => (
              <ContractItem
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

export default Contract;
