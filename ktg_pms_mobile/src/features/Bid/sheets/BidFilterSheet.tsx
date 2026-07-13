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
import { BID_STATUS } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { BidFilterParams } from "~/services/bid/bid.type";
import globalStyle from "~/styles/global-style";
import { useBidFilterOptions } from "../hooks/useBid";

interface BidFilterSheetProps {
  initialFilters: BidFilterParams;
  onApply: (filters: BidFilterParams, isReset?: boolean) => void;
  onClose: () => void;
}

const BidFilterSheet = ({
  initialFilters,
  onApply,
  onClose,
}: BidFilterSheetProps) => {
  const { spacing, colors } = useTheme();
  const [filters, setFilters] = useState<BidFilterParams>(initialFilters);
  const [isReady, setIsReady] = useState(false);
  const { data: options } = useBidFilterOptions();
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
      setIsSheetLoading(false);
      clearTimeout(timer);
      showL.remove();
      hideL.remove();
    };
  }, []);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: BidFilterParams = {
      pageIndex: 1,
      pageSize: 10,
      keyword: "",
      code: "",
      name: "",
      companyId: undefined,
      reference: undefined,
      techName: "",
      tradeName: "",
      biddingCouncil: "",
      projectId: undefined,
      masterBidGuaranteeId: undefined,
      purpose: undefined,
      bidTypeCode: undefined,
      status: BID_STATUS.WAITING_APPROVAL,
      createdAt: undefined,
      acceptEndDate: undefined,
      submitEndDate: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters, true);
  };

  const updateFilter = <K extends keyof BidFilterParams>(
    key: K,
    value: BidFilterParams[K],
  ) => {
    setFilters((prev: BidFilterParams) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet type="filter" onClose={onClose} />
      {!isReady ? (
        <View style={globalStyle.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={globalStyle.loadingIndicator}
          />
        </View>
      ) : (
        <>
          <BottomSheetScrollView
            style={{
              flex: 1,
              padding: spacing.sm,
              backgroundColor: colors.lgrayBg,
            }}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === "android"}
          >
            <Column style={{ gap: spacing.sm, paddingBottom: 20 }}>
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
                      value={filters.name || filters.keyword}
                      onChangeText={(val) => {
                        updateFilter("name", val);
                        updateFilter("keyword", val);
                      }}
                      InputComponent={BottomSheetTextInput}
                    />
                  }
                  underline={false}
                />
              </Row>

              <ColumnFilter
                label="Công ty mời thầu"
                value={
                  <SelectPicker
                    listSelection={options?.companies || []}
                    value={filters.companyId}
                    onSelect={(selected: any) =>
                      updateFilter("companyId", selected.value)
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

              <ColumnFilter
                label="Nguồn tham chiếu"
                value={
                  <SelectPicker
                    listSelection={options?.references || []}
                    value={filters.reference}
                    onSelect={(selected: any) =>
                      updateFilter("reference", selected.value)
                    }
                    placeholder="Chọn nguồn tham chiếu"
                    labelKeys={["label"]}
                    valueKey="value"
                  />
                }
                full
                underline={false}
              />

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

              <ColumnFilter
                label="Hội đồng xét thầu"
                value={
                  <Input
                    placeholder="Nhập hội đồng"
                    value={filters.biddingCouncil}
                    onChangeText={(val) => updateFilter("biddingCouncil", val)}
                    InputComponent={BottomSheetTextInput}
                  />
                }
                full
                underline={false}
              />

              <ColumnFilter
                label="Dự án"
                value={
                  <SelectPicker
                    listSelection={options?.projects || []}
                    value={filters.projectId}
                    onSelect={(selected: any) =>
                      updateFilter("projectId", selected.value)
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

              <ColumnFilter
                label="Ký bảo lãnh dự thầu"
                value={
                  <SelectPicker
                    listSelection={options?.masterBidGuarantees || []}
                    value={filters.masterBidGuaranteeId}
                    onSelect={(selected: any) =>
                      updateFilter("masterBidGuaranteeId", selected.value)
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

              <Row gap={spacing.sm}>
                <ColumnFilter
                  label="Mục đích đấu thầu"
                  value={
                    <SelectPicker
                      listSelection={options?.purposes || []}
                      value={filters.purpose}
                      onSelect={(selected: any) =>
                        updateFilter("purpose", selected.value)
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
                      onSelect={(selected: any) =>
                        updateFilter("bidTypeCode", selected.value)
                      }
                      placeholder="Chọn"
                      labelKeys={["label"]}
                      valueKey="value"
                    />
                  }
                  underline={false}
                />
              </Row>

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
                        ])
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
                        ])
                      }
                      containerStyle={{ flex: 1 }}
                    />
                  </Row>
                }
                full
                underline={false}
              />

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
                        ])
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
                        ])
                      }
                      containerStyle={{ flex: 1 }}
                    />
                  </Row>
                }
                full
                underline={false}
              />

              <ColumnFilter
                label="Ngày hết hạn"
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
                        ])
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
                        ])
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
        </>
      )}

      {isReady && (Platform.OS === "ios" || !isKeyboardVisible) && (
        <FooterSheet onApply={handleApply} onReset={handleReset} />
      )}
    </View>
  );
};

export default React.memo(BidFilterSheet);
