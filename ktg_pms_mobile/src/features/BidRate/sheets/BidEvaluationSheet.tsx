import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Column, Icon, Row, Spacer, Text } from "~/common";
import { ApprovalButton, HeaderSheet, TextArea } from "~/components";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import {
  useApproveSupplierWinBid,
  useBidEvaluationData,
  useRejectSupplierWinBid,
} from "../hooks/useBidRate";

interface Props {
  bidId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BidEvaluationSheet = ({ bidId, onClose, onSuccess }: Props) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { start, stop } = useWaiting();
  const [comment, setComment] = useState("");
  // sync from bid-evaluation.component.ts:15-18 — checkOptionsOne default all checked
  const [rejectReasons, setRejectReasons] = useState([
    { label: "Đánh giá NL, KT", value: "YCKT", checked: true },
    {
      label: "Đánh giá bảng CG, CCG & Đánh giá DKTM",
      value: "CCG",
      checked: true,
    },
  ]);
  // sync from bid-evaluation.component.ts:36 — isNext controls step 1/2
  const [isNext, setIsNext] = useState(false);
  // sync from bid-evaluation.component.ts:32 — setOfCheckedId tracks selected suppliers
  const [checkedSuppliers, setCheckedSuppliers] = useState<any[]>([]);

  const { data: evaluationData, isLoading } = useBidEvaluationData(bidId);
  const { mutate: approveWinBid, isPending: isApproving } =
    useApproveSupplierWinBid();
  const { mutate: rejectWinBid, isPending: isRejecting } =
    useRejectSupplierWinBid();

  const isSubmitting = isApproving || isRejecting;
  const lstBidSupplier = evaluationData?.lstBidSupplier || [];
  const lstDetail = evaluationData?.lstDetail || [];
  const isMultiSupplier = lstBidSupplier.length > 1;

  // sync from bid-evaluation.component.ts:249
  const toggleSupplier = (supplier: any) => {
    setCheckedSuppliers((prev) => {
      const exists = prev.find((s) => s === supplier);
      return exists ? prev.filter((s) => s !== supplier) : [...prev, supplier];
    });
  };

  const handleToggleRejectReason = (index: number) => {
    setRejectReasons((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], checked: !next[index].checked };
      return next;
    });
  };

  // sync from bid-evaluation.component.ts:254 — onNext
  const handleNext = () => {
    if (checkedSuppliers.length === 0) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn ít nhất một nhà cung cấp",
      });
      return;
    }
    if (checkedSuppliers.length > lstDetail.length) {
      showToast({
        type: "warning",
        message:
          "Bạn không thể chọn nhiều nhà cung cấp thắng thầu vì số lượng Item hoặc hạng mục nhỏ hơn số lượng nhà cung cấp thắng có thể phân bổ",
      });
      return;
    }
    setIsNext(true);
  };

  // sync from bid-evaluation.component.ts:122 — onAccept / onAcceptBidSupplier
  const handleApprove = () => {
    if (!evaluationData) return;

    const selectedSuppliers = isMultiSupplier
      ? checkedSuppliers
      : lstBidSupplier;

    if (isMultiSupplier && checkedSuppliers.length === 0) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn ít nhất một nhà cung cấp",
      });
      return;
    }

    if (selectedSuppliers.length > lstDetail.length) {
      showToast({
        type: "warning",
        message:
          "Bạn không thể chọn nhiều nhà cung cấp thắng thầu vì số lượng Item hoặc hạng mục nhỏ hơn số lượng nhà cung cấp thắng có thể phân bổ",
      });
      return;
    }

    if (selectedSuppliers.length > 1) {
      const allHaveSupplier = lstDetail.every((item: any) => !!item.supplierId);
      if (!allHaveSupplier) {
        showToast({
          type: "warning",
          message:
            "Vui lòng phân bổ nhà cung cấp thắng thầu cho tất cả các dòng",
        });
        return;
      }
      const supplierIds = lstDetail.map((item: any) => item.supplierId);
      const uniqueSupplierIds = new Set(supplierIds);
      if (uniqueSupplierIds.size !== supplierIds.length) {
        showToast({
          type: "warning",
          message: "Mỗi dòng phải có nhà cung cấp khác nhau",
        });
        return;
      }
    }

    // sync from bid-evaluation.component.ts:178-183
    // Web admin dùng this.dataObject.id (id từ response), không phải bidId prop
    const resolvedBidId = evaluationData.id || bidId;

    start("Đang xử lý...");
    approveWinBid(
      {
        bidId: resolvedBidId,
        comment,
        listItem: lstDetail,
        lstBidSupplier: selectedSuppliers,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.data?.status === 200 || res.data?.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Thành công",
            });
            onSuccess();
            onClose();
          } else {
            showToast({
              type: "danger",
              message: res.data?.message || "Thất bại",
            });
          }
        },
        onError: () => {
          stop();
          showToast({ type: "danger", message: "Có lỗi xảy ra" });
        },
      },
    );
  };

  // sync from bid-evaluation.component.ts:191 — onReject
  const handleReject = () => {
    if (!evaluationData) return;
    // sync from bid-evaluation.component.ts:195-199
    // Web admin dùng this.dataObject.id (id từ response), không phải bidId prop
    const resolvedBidId = evaluationData.id || bidId;
    start("Đang xử lý...");
    rejectWinBid(
      {
        bidId: resolvedBidId,
        comment,
        listItem: lstDetail,
        recheck: rejectReasons,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.data?.status === 200 || res.data?.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Thành công",
            });
            onSuccess();
            onClose();
          } else {
            showToast({
              type: "danger",
              message: res.data?.message || "Thất bại",
            });
          }
        },
        onError: () => {
          stop();
          showToast({ type: "danger", message: "Có lỗi xảy ra" });
        },
      },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderSheet
        type="detail"
        title="Chọn NCC thắng thầu"
        iconName="award"
        iconType="feather"
        onClose={onClose}
      />

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 8 }}
      >
        <Column gap={10} align="stretch">
          {/* ── STEP 1: Bảng chọn NCC ── sync from bid-evaluation.component.html:8-99 */}
          {!isNext && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Danh sách nhà cung cấp
              </Text>

              {lstBidSupplier.map((supplier: any, index: number) => {
                if (!supplier) return null;
                const isChecked = !!(
                  checkedSuppliers.includes(supplier) ||
                  (!isMultiSupplier && supplier.isSuccessBid)
                );
                return (
                  <View
                    key={index}
                    style={[
                      styles.supplierCard,
                      {
                        borderColor: colors.border,
                        backgroundColor: isChecked
                          ? (colors.lblueBg as string)
                          : (colors.card as string),
                      },
                      isChecked && { borderColor: colors.active },
                    ]}
                  >
                    <Row align="center" gap={10}>
                      {isMultiSupplier && (
                        <Checkbox
                          label=" "
                          checked={isChecked}
                          onPress={() => toggleSupplier(supplier)}
                          sizeVariant="sm"
                          activeColor={colors.active}
                        />
                      )}
                      <Column gap={4} style={{ flex: 1 }}>
                        <Text
                          style={[styles.supplierName, { color: colors.text }]}
                        >
                          {supplier?.supplierName ||
                            supplier?.supplierCode ||
                            "---"}
                        </Text>
                        {/* Điểm hệ thống — sync from bid-evaluation.component.html:29-41 */}
                        <Row gap={8}>
                          <Text
                            style={[styles.scoreLabel, { color: colors.label }]}
                          >
                            {"Tổng: "}
                            <Text style={{ color: colors.active }}>
                              {supplier?.scoreTotal >= 0
                                ? supplier.scoreTotal
                                : "---"}
                            </Text>
                          </Text>
                          <Text
                            style={[styles.scoreLabel, { color: colors.label }]}
                          >
                            {"KT: "}
                            <Text>
                              {supplier?.scoreTech >= 0
                                ? supplier.scoreTech
                                : "---"}
                            </Text>
                          </Text>
                          <Text
                            style={[styles.scoreLabel, { color: colors.label }]}
                          >
                            {"BG: "}
                            <Text>
                              {supplier?.scorePrice >= 0
                                ? supplier.scorePrice
                                : "---"}
                            </Text>
                          </Text>
                          <Text
                            style={[styles.scoreLabel, { color: colors.label }]}
                          >
                            {"TM: "}
                            <Text>
                              {supplier?.scoreTrade >= 0
                                ? supplier.scoreTrade
                                : "---"}
                            </Text>
                          </Text>
                        </Row>
                      </Column>
                      {/* Circle-check icon khi được chọn */}
                      <Icon
                        name={isChecked ? "check-circle" : "circle"}
                        type="feather"
                        size={20}
                        color={
                          isChecked
                            ? (colors.active as string)
                            : (colors.border as string)
                        }
                      />
                    </Row>
                  </View>
                );
              })}

              <Spacer size={4} />

              {/* Ghi chú — sync from bid-evaluation.component.html:91-98 */}
              <TextArea
                label="Ghi chú"
                value={comment}
                onChangeText={setComment}
                placeholder="Nhập ghi chú (nếu có)..."
                numberOfLines={3}
              />

              {/* Reject reasons — sync from bid-evaluation.component.ts:15-18 */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Yêu cầu kiểm tra lại
              </Text>
              {rejectReasons.map((reason, index) => (
                <Checkbox
                  key={reason.value}
                  label={reason.label}
                  checked={reason.checked}
                  onPress={() => handleToggleRejectReason(index)}
                  sizeVariant="sm"
                  activeColor={colors.active}
                />
              ))}

              {/* Nút Tiếp tục — chỉ hiện khi >1 NCC, sync from bid-evaluation.component.html:256-268 */}
              {isMultiSupplier && (
                <View style={{ marginTop: 4 }}>
                  <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.active }]}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextBtnText}>Tiếp tục →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ── STEP 2: Phân bổ NCC cho từng item ── sync from bid-evaluation.component.html:100-211 */}
          {isNext && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Phân bổ nhà cung cấp cho từng hạng mục
              </Text>

              {lstDetail.map((item: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.detailCard,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                >
                  <Column gap={6}>
                    <Text style={[styles.supplierName, { color: colors.text }]}>
                      {item.name ||
                        item.shortText ||
                        `Item ${item.itemNo || index + 1}`}
                    </Text>
                    <Row gap={8}>
                      <Text
                        style={[styles.scoreLabel, { color: colors.label }]}
                      >
                        {"SL: "}
                        <Text>
                          {Number(
                            item.quantity ?? item.number ?? 0,
                          ).toLocaleString("en-US")}
                        </Text>
                      </Text>
                      <Text
                        style={[styles.scoreLabel, { color: colors.label }]}
                      >
                        {item.unitCode || ""}
                      </Text>
                    </Row>
                    {/* Chọn NCC cho dòng này */}
                    <Column gap={4}>
                      <Text
                        style={[styles.scoreLabel, { color: colors.label }]}
                      >
                        Nhà cung cấp:
                      </Text>
                      {checkedSuppliers.map((supplier: any, sIdx: number) => {
                        const isSelected =
                          item.supplierId === supplier.supplierId;
                        return (
                          <TouchableOpacity
                            key={sIdx}
                            style={[
                              styles.supplierOption,
                              { borderColor: colors.border },
                              isSelected && {
                                borderColor: colors.active,
                                backgroundColor: colors.lblueBg,
                              },
                            ]}
                            onPress={() => {
                              item.supplierId = supplier.supplierId;
                              // force re-render
                              setCheckedSuppliers((prev) => [...prev]);
                            }}
                          >
                            <Text
                              style={{
                                color: isSelected ? colors.active : colors.text,
                                fontSize: 13,
                              }}
                            >
                              {`${supplier.supplierCode} - ${supplier.supplierName}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </Column>
                  </Column>
                </View>
              ))}

              {/* Nút Trở lại — sync from bid-evaluation.component.html:270-282 */}
              <TouchableOpacity
                style={[styles.prevBtn, { borderColor: colors.red }]}
                onPress={() => setIsNext(false)}
              >
                <Text style={[styles.prevBtnText, { color: colors.red }]}>
                  ← Trở lại
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Spacer size={80} />
        </Column>
      </BottomSheetScrollView>

      {/* Nút hành động — chỉ hiện khi không ở bước phân bổ multi-supplier chưa xong
          isMultiSupplier step 1 → chỉ có "Trả về / Kiểm tra lại" (reject), nút approve
          chuyển sang step 2 qua handleNext
          isMultiSupplier step 2 → cả hai nút
          single supplier → cả hai nút ngay từ đầu */}
      <ApprovalButton
        actions={[
          {
            id: "reject-supplier",
            label: "Trả về",
            onPress: handleReject,
            type: "danger",
          },
          ...(!isMultiSupplier || isNext
            ? [
                {
                  id: "approve-supplier",
                  label: "Xác nhận NCC thắng thầu",
                  onPress: handleApprove,
                  type: "primary" as const,
                },
              ]
            : []),
        ]}
        isLoading={isSubmitting || isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  supplierCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "500",
  },
  scoreLabel: {
    fontSize: 12,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  supplierOption: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
  },
  nextBtn: {
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  prevBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  prevBtnText: {
    fontWeight: "600",
    fontSize: 14,
  },
});

export default BidEvaluationSheet;
