import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, Platform, View } from "react-native";
import { Column, DatePicker, Input, Row, SelectPicker } from "~/common";
import { FooterSheet, HeaderSheet } from "~/components";
import { ColumnFilter } from "~/components/ColumnFilter";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { useSheet } from "~/contexts/SheetContext";
import { BID_RATE_ALLOWED_STATUSES, BID_STATUS_CONFIG } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { BidRateFilterParams } from "~/services/bidRate/bidRate.type";
import globalStyle from "~/styles/global-style";
import { useBidRateFilterOptions } from "../hooks/useBidRate";

// sync from bid-rate.component.ts:64 — only the 8 allowedCodes shown in the list
const BID_RATE_STATUS_OPTIONS = BID_RATE_ALLOWED_STATUSES.map((code) => ({
  label: BID_STATUS_CONFIG[code]?.name || code,
  value: code,
}));

interface BidRateFilterSheetProps {
  initialFilters: BidRateFilterParams;
  onApply: (filters: BidRateFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const BidRateFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: BidRateFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] = useState<BidRateFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useBidRateFilterOptions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { setIsSheetLoading } = useSheet();

  useEffect(() => {
    setIsSheetLoading(true);
    const timer = setTimeout(() => {
      setIsReady(true);
      setIsSheetLoading(false);
    }, BOTTOM_SHEET_TIME_LOADING);

    const showL = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideL = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      clearTimeout(timer);
      setIsSheetLoading(false);
      showL.remove();
      hideL.remove();
    };
  }, []);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  // sync from bid-rate.component.ts:64 — reset restores the full allowedCodes array
  const handleReset = () => {
    const resetFilters: BidRateFilterParams = {
      pageIndex: 1,
      pageSize: 10,
      keyword: "",
      code: "",
      companyId: undefined,
      techName: "",
      tradeName: "",
      biddingCouncil: "",
      projectId: undefined,
      masterBidGuaranteeId: undefined,
      purpose: undefined,
      bidTypeCode: undefined,
      status: BID_RATE_ALLOWED_STATUSES,
      createdAt: undefined,
      acceptEndDate: undefined,
      submitEndDate: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof BidRateFilterParams>(
    key: K,
    value: BidRateFilterParams[K],
  ) => {
    setFilters((prev: BidRateFilterParams) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="filter" onClose={onClose} />

      {isReady ? (
        <BottomSheetScrollView
          style={{
            flex: 1,
            padding: spacing.sm,
            gap: 10,
            backgroundColor: colors.lgrayBg,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
        >
          <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
            {/* Trạng thái — sync from bid-rate.component.html:45 */}
            {/* <ColumnFilter
              label="Trạng thái"
              value={
                <SelectPicker
                  listSelection={[
                    { label: "Tất cả (mặc định)", value: undefined },
                    ...BID_RATE_STATUS_OPTIONS,
                  ]}
                  value={
                    Array.isArray(filters.status) ? undefined : filters.status
                  }
                  onSelect={(item: Record<string, any>) =>
                    updateFilter(
                      "status",
                      item.value ?? BID_RATE_ALLOWED_STATUSES,
                    )
                  }
                  placeholder="Chọn trạng thái"
                  labelKeys={["label"]}
                  valueKey="value"
                />
              }
              full
              underline={false}
            /> */}

            {/* Mã & Tên — sync from bid-rate.component.html:57-64 */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mã gói thầu"
                value={
                  <Input
                    placeholder="Nhập mã"
                    value={filters.code}
                    onChangeText={(val) => updateFilter("code", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Tên gói thầu"
                value={
                  <Input
                    placeholder="Nhập tên"
                    value={filters.keyword}
                    onChangeText={(val) => updateFilter("keyword", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            {/* Công ty mời thầu — sync from bid-rate.component.html:65-77 */}
            <ColumnFilter
              label="Công ty mời thầu"
              value={
                <SelectPicker
                  listSelection={options?.companies || []}
                  value={filters.companyId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("companyId", item.value)
                  }
                  placeholder="Chọn công ty mời thầu"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              }
              full
              underline={false}
            />

            {/* Phụ trách kỹ thuật & mua hàng — sync from bid-rate.component.html:78-99 */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Phụ trách kỹ thuật"
                value={
                  <Input
                    placeholder="Nhập"
                    value={filters.techName}
                    onChangeText={(val) => updateFilter("techName", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Phụ trách mua hàng"
                value={
                  <Input
                    placeholder="Nhập"
                    value={filters.tradeName}
                    onChangeText={(val) => updateFilter("tradeName", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                underline={false}
              />
            </Row>

            {/* Hội đồng xét thầu — sync from bid-rate.component.html:100-110 */}
            <ColumnFilter
              label="Hội đồng xét thầu"
              value={
                <Input
                  placeholder="Nhập hội đồng xét thầu"
                  value={filters.biddingCouncil}
                  onChangeText={(val) => updateFilter("biddingCouncil", val)}
                  InputComponent={BottomSheetTextInput}
                />
              }
              full
              underline={false}
            />

            {/* Hình thức bảo lãnh dự thầu — sync from bid-rate.component.html:111-123 */}
            <ColumnFilter
              label="Hình thức bảo lãnh dự thầu"
              value={
                <SelectPicker
                  listSelection={options?.masterBidGuarantees || []}
                  value={filters.masterBidGuaranteeId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("masterBidGuaranteeId", item.value)
                  }
                  placeholder="Chọn hình thức bảo lãnh"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              }
              full
              underline={false}
            />

            {/* Dự án — sync from bid-rate.component.html:124-137 */}
            <ColumnFilter
              label="Dự án"
              value={
                <SelectPicker
                  listSelection={options?.projects || []}
                  value={filters.projectId}
                  onSelect={(item: Record<string, any>) =>
                    updateFilter("projectId", item.value)
                  }
                  placeholder="Chọn dự án"
                  labelKeys={["label"]}
                  valueKey="value"
                  search={true}
                />
              }
              full
              underline={false}
            />

            {/* Mục đích & Hình thức đấu thầu — sync from bid-rate.component.html:139-164 */}
            <Row gap={spacing.sm}>
              <ColumnFilter
                label="Mục đích đấu thầu"
                value={
                  <SelectPicker
                    listSelection={options?.purposes || []}
                    value={filters.purpose}
                    onSelect={(item: Record<string, any>) =>
                      updateFilter("purpose", item.value)
                    }
                    placeholder="Chọn"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
              <ColumnFilter
                label="Hình thức đấu thầu"
                value={
                  <SelectPicker
                    listSelection={options?.bidTypes || []}
                    value={filters.bidTypeCode}
                    onSelect={(item: Record<string, any>) =>
                      updateFilter("bidTypeCode", item.value)
                    }
                    placeholder="Chọn"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                underline={false}
              />
            </Row>

            {/* Ngày tạo — sync from bid-rate.component.html:165-169 */}
            <ColumnFilter
              label="Ngày tạo"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.createdAt?.[0]
                        ? moment(filters.createdAt[0]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("createdAt", [
                        moment(date).format("YYYY-MM-DD"),
                        filters.createdAt?.[1],
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.createdAt?.[1]
                        ? moment(filters.createdAt[1]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("createdAt", [
                        filters.createdAt?.[0],
                        moment(date).format("YYYY-MM-DD"),
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
            />

            {/* Ngày xác nhận tham gia — sync from bid-rate.component.html:170-174 */}
            <ColumnFilter
              label="Ngày xác nhận tham gia"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.acceptEndDate?.[0]
                        ? moment(filters.acceptEndDate[0]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("acceptEndDate", [
                        moment(date).format("YYYY-MM-DD"),
                        filters.acceptEndDate?.[1],
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.acceptEndDate?.[1]
                        ? moment(filters.acceptEndDate[1]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("acceptEndDate", [
                        filters.acceptEndDate?.[0],
                        moment(date).format("YYYY-MM-DD"),
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
            />

            {/* Ngày hết hạn nộp hồ sơ — sync from bid-rate.component.html:175-179 */}
            <ColumnFilter
              label="Ngày hết hạn nộp hồ sơ"
              value={
                <Row gap={12}>
                  <DatePicker
                    label="Từ"
                    value={
                      filters.submitEndDate?.[0]
                        ? moment(filters.submitEndDate[0]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("submitEndDate", [
                        moment(date).format("YYYY-MM-DD"),
                        filters.submitEndDate?.[1],
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                  <DatePicker
                    label="Đến"
                    value={
                      filters.submitEndDate?.[1]
                        ? moment(filters.submitEndDate[1]).toDate()
                        : undefined
                    }
                    onChange={(date) =>
                      updateFilter("submitEndDate", [
                        filters.submitEndDate?.[0],
                        moment(date).format("YYYY-MM-DD"),
                      ] as [string, string])
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </Row>
              }
              full
              underline={false}
              last
            />
          </Column>
        </BottomSheetScrollView>
      ) : (
        <View style={globalStyle.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={globalStyle.loadingIndicator}
          />
        </View>
      )}

      {isReady && (Platform.OS === "ios" || !isKeyboardVisible) && (
        <FooterSheet onApply={handleApply} onReset={handleReset} />
      )}
    </View>
  );
};

export default React.memo(BidRateFilterSheet);
