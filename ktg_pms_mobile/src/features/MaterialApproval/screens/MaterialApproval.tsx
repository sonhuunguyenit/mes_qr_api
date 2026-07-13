import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Empty, Header, Linear } from "~/common";
import { Container } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { PLACEHOLDER_SEARCH_BAR } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  MaterialFilterParams,
  MaterialItemData,
} from "~/services/material/material.type";
import globalStyle from "~/styles/global-style";
import MaterialApprovalItem from "../components/MaterialApprovalItem";
import MaterialApprovalItemSkeleton from "../components/MaterialApprovalItemSkeleton";
import { useMaterialList } from "../hooks";
import MaterialApprovalFilterSheet from "../sheets/MaterialApprovalFilterSheet";
import { goMaterialApprovalDetail } from "~/utils/navigate";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.MaterialApproval
>;

const MaterialApprovalScreen = ({ navigation, route }: Props) => {
  const { openSheet, closeSheet } = useSheet();
  const listTargetId = route.params?.listTargetId;
  const type = route.params?.type;

  const [filters, setFilters] = useState<MaterialFilterParams>({
    status: "WAIT_APPROVE",
    isDeleted: undefined,
    code: "",
    name: "",
    materialGroupId: undefined,
    externalMaterialGroupId: undefined,
    plantId: undefined,
    divisionId: undefined,
    createdAt: undefined,
    createdByName: "",
    blockAllDate: undefined,
    keyword: "",
    listTargetId,
    type,
    pageIndex: 1,
    pageSize: 10,
  });

  const {
    data: materialListData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMaterialList(filters);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleApplyFilter = useCallback((newFilters: MaterialFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 1 }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasFilter =
    !!filters.code ||
    !!filters.name ||
    !!filters.materialGroupId ||
    !!filters.externalMaterialGroupId ||
    !!filters.plantId ||
    !!filters.divisionId ||
    !!filters.createdByName ||
    filters.isDeleted !== undefined ||
    filters.status !== "WAIT_APPROVE" ||
    !!filters.createdAt ||
    !!filters.blockAllDate ||
    !!filters.keyword;

  const filterSheetFactory = useMemo(() => {
    return () => (
      <MaterialApprovalFilterSheet
        initialFilters={filters}
        onApply={handleApplyFilter}
        onClose={closeSheet}
      />
    );
  }, [filters, handleApplyFilter, closeSheet]);

  const openFilter = useCallback(() => {
    openSheet(filterSheetFactory);
  }, [filterSheetFactory, openSheet]);

  const renderItem = ({ item }: { item: MaterialItemData }) => (
    <MaterialApprovalItem
      item={item}
      onPress={() => {
        goMaterialApprovalDetail(item);
      }}
    />
  );

  const displayData =
    materialListData?.pages?.flatMap((page) => page.data?.[0] || []) || [];

  return (
    <Linear>
      <Header
        title="Lệnh duyệt Material"
        subTitle="Danh sách Material chờ duyệt"
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
            renderItem={() => <MaterialApprovalItemSkeleton />}
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
              isFetchingNextPage ? <MaterialApprovalItemSkeleton /> : null
            }
          />
        )}
      </Container>
    </Linear>
  );
};

export default MaterialApprovalScreen;
