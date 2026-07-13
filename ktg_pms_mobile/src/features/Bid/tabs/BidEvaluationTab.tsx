import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Column, Spacer, Text } from "~/common";
import { ApprovalButton } from "~/components";
import { BID_STATUS } from "~/enums";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import globalStyle from "~/styles/global-style";
import {
  useApproveSupplierWinBid,
  useBidEvaluationData,
  useEvalBidSupplier,
  useRejectSupplierWinBid,
} from "../../BidRate/hooks/useBidRate";
import { StepItemAllocation, StepSupplierSelection } from "../components";

interface Props {
  bidId: string;
  onSuccess: () => void;
}

// sync from bid-evaluation.component.ts:122 — scoreRankABCD helper
const scoreRankABCD = (value?: number): string => {
  if (value === undefined || value === null || value === -1) return "-";
  return String(value);
};

export const BidEvaluationTab = ({ bidId, onSuccess }: Props) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { start, stop } = useWaiting();

  const [comment, setComment] = useState("");
  const rejectReasons = [
    { label: "Đánh giá NL, KT", value: "YCKT", checked: true },
    {
      label: "Đánh giá bảng CG, CCG & Đánh giá DKTM",
      value: "CCG",
      checked: true,
    },
  ];
  // sync from bid-evaluation.component.ts:36 — isNext
  const [isNext, setIsNext] = useState(false);
  // sync from bid-evaluation.component.ts:32 — setOfCheckedId
  const [checkedSuppliers, setCheckedSuppliers] = useState<any[]>([]);
  // sync from bid-evaluation.component.ts:38 — lstSupplierChoose
  const [lstSupplierChoose, setLstSupplierChoose] = useState<any[]>([]);
  // Local state to keep track of item assignments without mutating React Query cache directly
  const [mutableDetail, setMutableDetail] = useState<any[]>([]);

  const { data: evaluationData, isLoading } = useBidEvaluationData(bidId);
  const { mutate: approveWinBid, isPending: isApproving } =
    useApproveSupplierWinBid();
  const { mutate: rejectWinBid, isPending: isRejecting } =
    useRejectSupplierWinBid();
  const { mutate: evalBidSupplier, isPending: isEvaluating } =
    useEvalBidSupplier();

  const isSubmitting = isApproving || isRejecting || isEvaluating;
  const lstBidSupplier = evaluationData?.lstBidSupplier || [];
  const lstDetail = evaluationData?.lstDetail || [];
  const isMultiSupplier = lstBidSupplier.length > 1;
  // sync from Web Admin: dùng số NCC ĐƯỢC TICK CHỌN (setOfCheckedId.size) để điều khiển UI
  // Không dùng isMultiSupplier (tổng NCC tham gia) như cũ
  const isMultiChecked = checkedSuppliers.length > 1;

  // sync from bid-evaluation.component.html:214-295 — button visibility logic
  const evalStatus = evaluationData?.status;
  const isCanApprove = evaluationData?.isCanApprove;
  const isNoItem = evaluationData?.reference === "NO_ITEM";
  const resolvedBidId = evaluationData?.id || bidId;

  // BUG 1: Auto pre-check suppliers that already won (isSuccessBid = true)
  useEffect(() => {
    if (evaluationData?.lstBidSupplier) {
      const preChecked = evaluationData.lstBidSupplier.filter(
        (s: any) => s.isSuccessBid,
      );
      if (preChecked.length > 0) {
        setCheckedSuppliers(preChecked);
      }
    }
  }, [evaluationData]);

  // BUG 3: Clone lstDetail into mutable state to safely modify supplierId
  useEffect(() => {
    if (evaluationData?.lstDetail) {
      setMutableDetail(
        evaluationData.lstDetail.map((item: any) => ({ ...item })),
      );
    }
  }, [evaluationData]);

  // sync from bid-evaluation.component.ts:249
  const toggleSupplier = (supplier: any) => {
    setCheckedSuppliers((prev) => {
      const exists = prev.find((s) => s.supplierId === supplier.supplierId);
      return exists
        ? prev.filter((s) => s.supplierId !== supplier.supplierId)
        : [...prev, supplier];
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
    if (checkedSuppliers.length > mutableDetail.length) {
      showToast({
        type: "warning",
        message:
          "Bạn không thể chọn nhiều nhà cung cấp thắng thầu vì số lượng Item hoặc hạng mục nhỏ hơn số lượng nhà cung cấp thắng có thể phân bổ",
      });
      return;
    }
    // BUG 2: Copy checkedSuppliers to lstSupplierChoose when going to step 2
    setLstSupplierChoose([...checkedSuppliers]);
    setIsNext(true);
  };

  // sync from bid-evaluation.component.ts:273 — onPrev resets lstSupplierChoose but keeps checkedSuppliers
  const handlePrev = () => {
    setIsNext(false);
    setLstSupplierChoose([]); // sync: lstSupplierChoose = [] when returning to step 1
  };

  // Helper: assign supplier to an item index in step 2
  const assignSupplier = (itemIndex: number, supplierId: string | null) => {
    setMutableDetail((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              supplierId: supplierId || null,
            }
          : item,
      ),
    );
  };

  // Helper: validate before approve (sync from web validation updates)
  const validateApprove = (selectedSuppliers: any[]): boolean => {
    if (isMultiSupplier && selectedSuppliers.length === 0) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn ít nhất một nhà cung cấp",
      });
      return false;
    }
    if (selectedSuppliers.length > mutableDetail.length) {
      showToast({
        type: "warning",
        message:
          "Bạn không thể chọn nhiều nhà cung cấp thắng thầu vì số lượng Item hoặc hạng mục nhỏ hơn số lượng nhà cung cấp thắng có thể phân bổ",
      });
      return false;
    }
    if (selectedSuppliers.length > 1) {
      // 1. Check if all items are assigned a winning supplier
      const allHaveSupplier = mutableDetail.every(
        (item: any) => !!item.supplierId,
      );
      if (!allHaveSupplier) {
        showToast({
          type: "warning",
          message:
            "Vui lòng phân bổ nhà cung cấp thắng thầu cho tất cả các dòng",
        });
        return false;
      }
      // BUG 5: Each checked winning supplier must be assigned at least 1 item
      const assignedSupplierIds = new Set(
        mutableDetail.map((item: any) => item.supplierId),
      );
      const unassignedSupplier = lstSupplierChoose.find(
        (s: any) => !assignedSupplierIds.has(s.supplierId),
      );
      if (unassignedSupplier) {
        showToast({
          type: "warning",
          message: `Nhà cung cấp "${unassignedSupplier.supplierName || unassignedSupplier.supplierCode}" chưa được phân bổ item nào`,
        });
        return false;
      }
    }
    return true;
  };

  // sync from bid-evaluation.component.ts:80 — onAcceptBidSupplier
  // Nút "Xác nhận kết quả": chỉ dành cho trường hợp tick <= 1 NCC (bước 1, không qua bước chia item)
  // API: EVALUATION_BID_SUPPLIER
  const handleAcceptBidSupplier = () => {
    if (!evaluationData) return;
    let selectedSuppliers: any[];
    if (lstBidSupplier.length > 1) {
      // Nhiều NCC tham gia thầu: bắt buộc phải tick chọn ít nhất 1
      if (checkedSuppliers.length === 0) {
        showToast({
          type: "warning",
          message: "Vui lòng chọn ít nhất một nhà cung cấp",
        });
        return;
      }
      selectedSuppliers = checkedSuppliers;
    } else {
      // Chỉ có 1 NCC tham gia: lấy toàn bộ (Web Admin: lstBidSupplier = this.dataObject.lstBidSupplier)
      selectedSuppliers = lstBidSupplier;
    }
    start("Đang xử lý...");
    evalBidSupplier(
      {
        bidId: resolvedBidId,
        // Web Admin onAcceptBidSupplier: comment = this.dataObject.noteCloseBidMPO
        comment: evaluationData.noteCloseBidMPO ?? comment,
        listItem: mutableDetail,
        lstBidSupplier: selectedSuppliers,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.status === 200 || res.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Thành công",
            });
            onSuccess();
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

  // sync from bid-evaluation.component.ts:280 — onSave
  // Nút "Lưu": dành cho trường hợp tick > 1 NCC và đã chia xong item (bước 2)
  // API: EVALUATION_BID_SUPPLIER (cùng API với Xác nhận, khác payload lstBidSupplier)
  const handleSave = () => {
    if (!evaluationData) return;
    // Validate: tất cả item phải có NCC, mỗi NCC phải được chia ít nhất 1 item
    if (!validateApprove(checkedSuppliers)) return;
    start("Đang xử lý...");
    evalBidSupplier(
      {
        bidId: resolvedBidId,
        // Web Admin onSave: comment = this.dataObject.noteCloseBidMPO
        comment: evaluationData.noteCloseBidMPO ?? comment,
        listItem: mutableDetail,
        // Web Admin onSave: lstBidSupplier = this.dataObject.lstBidSupplier (toàn bộ)
        lstBidSupplier: lstBidSupplier,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.status === 200 || res.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Lưu thành công",
            });
            onSuccess();
          } else {
            showToast({
              type: "danger",
              message: res.data?.message || "Lưu thất bại",
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

  // sync from bid-evaluation.component.ts:122 — onAccept (status S/D + isCanApprove)
  // API: APPROVE_SUPPLIER_WIN_BID (khác với EVALUATION_BID_SUPPLIER)
  const handleApprove = () => {
    if (!evaluationData) return;
    // Web Admin: dùng setOfCheckedId.size > 1 — Mobile: dùng isMultiChecked (số NCC được tick chọn)
    const selectedSuppliers = isMultiChecked
      ? checkedSuppliers
      : lstBidSupplier;
    if (!validateApprove(selectedSuppliers)) return;
    start("Đang phê duyệt...");
    approveWinBid(
      {
        bidId: resolvedBidId,
        // Web Admin onAccept: comment = this.dataObject.comment (do quản lý nhập trực tiếp)
        comment,
        listItem: mutableDetail,
        lstBidSupplier: selectedSuppliers,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.status === 200 || res.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Phê duyệt thành công",
            });
            onSuccess();
          } else {
            showToast({
              type: "danger",
              message: res.data?.message || "Phê duyệt thất bại",
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

  // sync from bid-evaluation.component.ts:191 — onReject (status S/D + isCanApprove)
  const handleReject = () => {
    if (!evaluationData) return;
    start("Đang xử lý...");
    rejectWinBid(
      {
        bidId: resolvedBidId,
        comment,
        listItem: mutableDetail,
        recheck: rejectReasons,
      },
      {
        onSuccess: (res) => {
          stop();
          if (res.status === 200 || res.status === 201) {
            showToast({
              type: "success",
              message: res.data?.message || "Thành công",
            });
            onSuccess();
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

  // ── Button visibility (sync từ bid-evaluation.component.html:158-201) ──
  // Dùng `isMultiChecked` (số NCC được TICK CHỌN) thay vì `isMultiSupplier` (tổng NCC tham gia)
  // Web Admin: setOfCheckedId.size <= 1 → Xác nhận | setOfCheckedId.size > 1 → Tiếp tục/Lưu

  // "Xác nhận kết quả": (status F_E || F_B) && setOfCheckedId.size <= 1
  const showAcceptBidSupplier =
    (evalStatus === BID_STATUS.EVALUATION_COMPLETED ||
      evalStatus === BID_STATUS.NEGOTIATION_COMPLETED) &&
    !isMultiChecked;

  // "Phê duyệt kết quả" và "Từ chối duyệt": (status S || D) && isCanApprove
  const showApproveReject =
    (evalStatus === BID_STATUS.SUPPLIER_SELECTED ||
      evalStatus === BID_STATUS.APPROVING_RESULT) &&
    isCanApprove === true;

  // "Tiếp tục": setOfCheckedId.size > 1 && !isNext
  const showNext = isMultiChecked && !isNext;

  // "Trở lại": setOfCheckedId.size > 1 && isNext
  const showPrev = isMultiChecked && isNext;

  // "Lưu": status !== S && status !== D && setOfCheckedId.size > 1 && isNext
  const showSave =
    evalStatus !== BID_STATUS.SUPPLIER_SELECTED &&
    evalStatus !== BID_STATUS.APPROVING_RESULT &&
    isMultiChecked &&
    isNext;

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.label }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyle.scrollContainerDetail}
      >
        <Column gap={10} align="stretch" style={{ paddingHorizontal: 5 }}>
          {/* ── STEP 1: Bảng chọn NCC ── */}
          {!isNext && (
            <StepSupplierSelection
              lstBidSupplier={lstBidSupplier}
              checkedSuppliers={checkedSuppliers}
              isMultiSupplier={isMultiSupplier}
              toggleSupplier={toggleSupplier}
              comment={comment}
              setComment={setComment}
            />
          )}

          {/* ── STEP 2: Phân bổ NCC cho từng item ── */}
          {isNext && (
            <StepItemAllocation
              mutableDetail={mutableDetail}
              lstSupplierChoose={lstSupplierChoose}
              assignSupplier={assignSupplier}
            />
          )}

          <Spacer size={20} />
        </Column>
      </ScrollView>

      {/* ── Action buttons — sync từ bid-evaluation.component.html:214-295 ── */}
      <ApprovalButton
        actions={[
          // "Trở lại" — size > 1 && isNext
          ...(showPrev
            ? [
                {
                  id: "prev-bid-evaluation",
                  label: "Trở lại",
                  onPress: handlePrev,
                  type: "secondary" as const,
                },
              ]
            : []),
          // "Từ chối duyệt" — (status S/D) && isCanApprove
          ...(showApproveReject
            ? [
                {
                  id: "reject-win-bid",
                  label: "Từ chối",
                  onPress: handleReject,
                  type: "danger" as const,
                },
              ]
            : []),
          // "Xác nhận kết quả" — (status F_E/F_B) && size <= 1
          ...(showAcceptBidSupplier
            ? [
                {
                  id: "accept-bid-supplier",
                  label: "Xác nhận",
                  onPress: handleAcceptBidSupplier,
                  type: "success" as const,
                },
              ]
            : []),
          // "Phê duyệt kết quả" — (status S/D) && isCanApprove
          ...(showApproveReject
            ? [
                {
                  id: "approve-win-bid",
                  label: "Phê duyệt",
                  onPress: handleApprove,
                  type: "primary" as const,
                },
              ]
            : []),
          // "Tiếp tục" — size > 1 && !isNext
          ...(showNext
            ? [
                {
                  id: "next-bid-evaluation",
                  label: "Tiếp tục",
                  onPress: handleNext,
                  type: "secondary" as const,
                },
              ]
            : []),
          // "Lưu" — multi + isNext + status not S/D (Web Admin: onSave)
          ...(showSave
            ? [
                {
                  id: "save-bid-supplier",
                  label: "Lưu",
                  onPress: handleSave,
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
  groupLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
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
  scoreChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 56,
  },
  scoreChipLabel: {
    fontSize: 11,
  },
  scoreChipVal: {
    fontSize: 13,
    fontWeight: "600",
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailVal: {
    fontSize: 12,
    flex: 1,
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
