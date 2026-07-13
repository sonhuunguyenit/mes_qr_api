import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Collapse,
  Column,
  Container,
  Header,
  Icon,
  Linear,
  Row,
  Spacer,
  Table,
  Text,
} from "~/common";
import { ApprovalButton, Status } from "~/components";
import { ROUTE_KEYS } from "~/constants/route";
import { SupplierLawStatus } from "~/enums/supplier-law.enum";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { AppNavigatorParamList } from "~/navigation/navigation.type";
import {
  SupplierLawData,
  LegalRepresentative,
  BankAccount,
  RevenueHistory,
} from "~/services/supplier/supplier-law.type";
import { goBack } from "~/utils/navigate";
import SupplierLawDetailSkeleton from "../components/SupplierLawDetailSkeleton";
import { useSupplierLaw } from "../hooks/useSupplierLaw";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierLawBankDetailSheet } from "../sheets/SupplierLawBankDetailSheet";
import DateHelper from "~/utils/date";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierLawDetail
>;

const SupplierLawDetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const {
    useLawDetail,
    useApprove,
    useReject,
    useBankCountries,
    useBankRegions,
    useBankList,
    useBankBranchList,
  } = useSupplierLaw();
  const { show, hide } = useModal();
  const { openSheet } = useSheet();
  const { showToast } = useToast();
  const item = route.params?.item;

  const { data: detail, isLoading: loading } = useLawDetail(item?.id);
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const { data: countries } = useBankCountries();
  const { data: regions } = useBankRegions();
  const { data: banks } = useBankList();
  const { data: bankBranches } = useBankBranchList();

  const parsedOld = useMemo(
    () =>
      detail?.oldJson ? (JSON.parse(detail.oldJson) as SupplierLawData) : null,
    [detail?.oldJson],
  );
  const parsedNew = useMemo(
    () =>
      detail?.newJson ? (JSON.parse(detail.newJson) as SupplierLawData) : null,
    [detail?.newJson],
  );

  // --- SECTION I: THÔNG TIN CHUNG (COMPARE ALL 33 FIELDS) ---
  const fieldMap: {
    key: keyof SupplierLawData;
    label: string;
    format?: "currency" | "date" | "boolean";
  }[] = useMemo(
    () => [
      { key: "name", label: "Tên doanh nghiệp" },
      { key: "dealName", label: "Tên giao dịch" },
      { key: "abbreviation", label: "Tên viết tắt" },
      { key: "businessTypeName", label: "Loại hình doanh nghiệp" },
      { key: "countryName", label: "Quốc gia" },
      { key: "regionName", label: "Tỉnh thành" },
      { key: "regionCode", label: "Region" },
      { key: "address", label: "Trụ sở chính" },
      { key: "postalCode", label: "Postal Code" },
      { key: "dealAddress", label: "Địa chỉ giao dịch (1)" },
      { key: "dealAddress2", label: "Địa chỉ giao dịch (2)" },
      { key: "dealAddress3", label: "Địa chỉ giao dịch (3)" },
      { key: "dealAddress4", label: "Địa chỉ giao dịch (4)" },
      { key: "dealAddress5", label: "Địa chỉ giao dịch (5)" },
      { key: "note", label: "Ghi chú" },
      { key: "phone", label: "Số điện thoại thông báo hệ thống" },
      { key: "email", label: "Email" },
      { key: "fax", label: "Số Fax" },
      { key: "website", label: "Website" },
      { key: "createYear", label: "Ngày thành lập công ty", format: "date" },
      { key: "businessTypeName", label: "Loại hình doanh nghiệp" },
      { key: "capital", label: "Vốn điều lệ", format: "currency" },
      { key: "assets", label: "Tài sản cố định", format: "currency" },
      {
        key: "dateStart",
        label: "Ngày bắt đầu giao dịch với Kim Tín",
        format: "date",
      },
      { key: "chief", label: "Tên giám đốc" },
      { key: "contactName", label: "Người liên hệ" },
      {
        key: "description",
        label: "Sơ lược về quá trình hình thành & phát triển",
      },
      { key: "fileBill", label: "File hóa đơn mẫu/phiếu thu/biên lai" },
      { key: "fileInfoBill", label: "File thông tin phát hành hóa đơn" },
      { key: "fileMST", label: "Giấy phép kinh doanh/Mã số thuế" },
      {
        key: "conditionalBusinessLicense",
        label: "Giấy phép kinh doanh có điều kiện",
      },
      { key: "isInternal", label: "Là ncc nội bộ", format: "boolean" },
      { key: "isClient", label: "Là khách hàng", format: "boolean" },
    ],
    [],
  );

  const generalRows = useMemo(() => {
    if (!parsedOld || !parsedNew) return [];

    const formatCurrency = (val: any) => {
      if (val === undefined || val === null || val === "") return "---";
      const num = Number(val);
      return isNaN(num) ? val.toString() : num.toLocaleString("vi-VN");
    };

    const formatVal = (val: any, format?: "currency" | "date" | "boolean") => {
      if (format === "boolean") return val ? "Có" : "Không";
      if (val === undefined || val === null || val === "") return "---";
      if (format === "currency") return formatCurrency(val);
      if (format === "date") return DateHelper.formatDate(val, "DD/MM/YYYY");
      return val.toString();
    };

    return fieldMap.map((field) => {
      let oldValRaw = parsedOld[field.key];
      let newValRaw = parsedNew[field.key];

      if (field.key === "createYear") {
        oldValRaw = parsedOld.createYear || parsedOld.dateFound;
        newValRaw = parsedNew.createYear || parsedNew.dateFound;
      }

      const oldVal = formatVal(oldValRaw, field.format);
      const newVal = formatVal(newValRaw, field.format);
      const hasDiff = oldValRaw !== newValRaw;

      return {
        cells: [
          field.label,
          {
            text: newVal,
            style: hasDiff
              ? { color: "red", fontWeight: "600" as const }
              : undefined,
          },
          oldVal,
        ],
      };
    });
  }, [parsedOld, parsedNew, fieldMap]);

  // --- SECTION II: NGƯỜI ĐẠI DIỆN PHÁP LÝ ---
  const legalRepColumns = useMemo(
    () => [
      "STT",
      "Họ và tên",
      "Chức vụ",
      "Số điện thoại",
      "Số fax",
      "Email",
      "Loại thuế",
      "Mã số thuế",
      "Loại định danh",
      "Mã định danh",
      "Lưu ý",
    ],
    [],
  );

  const oldLegalRepRows = useMemo(() => {
    return (
      parsedOld?.lstLegalRepresentative?.map((rep, idx) => ({
        cells: [
          (idx + 1).toString(),
          rep.name || "---",
          rep.position || "---",
          rep.phone || "---",
          rep.fax || "---",
          rep.email || "---",
          rep.taxType || "---",
          rep.taxCode || "---",
          rep.idType || "---",
          rep.idNumber || "---",
          rep.note || "---",
        ],
      })) || []
    );
  }, [parsedOld?.lstLegalRepresentative]);

  const newLegalRepRows = useMemo(() => {
    return (
      parsedNew?.lstLegalRepresentative?.map((rep, idx) => {
        const oldRep = parsedOld?.lstLegalRepresentative?.[idx];
        const isDiff = (field: keyof LegalRepresentative) => {
          if (!oldRep) return true;
          return rep[field] !== oldRep[field];
        };

        const renderCell = (
          field: keyof LegalRepresentative,
          defaultVal: string = "---",
        ) => {
          const val = rep[field]?.toString() || defaultVal;
          return isDiff(field)
            ? { text: val, style: { color: "red", fontWeight: "600" as const } }
            : val;
        };

        return {
          cells: [
            (idx + 1).toString(),
            renderCell("name"),
            renderCell("position"),
            renderCell("phone"),
            renderCell("fax"),
            renderCell("email"),
            renderCell("taxType"),
            renderCell("taxCode"),
            renderCell("idType"),
            renderCell("idNumber"),
            renderCell("note"),
          ],
        };
      }) || []
    );
  }, [parsedOld?.lstLegalRepresentative, parsedNew?.lstLegalRepresentative]);

  // --- SECTION III: DANH SÁCH NGÂN HÀNG ---
  const bankColumns = useMemo(
    () => [
      "Quốc gia",
      "Tỉnh thành",
      "Mã ngân hàng",
      "Chi nhánh ngân hàng",
      "Số tài khoản",
      "Nhập bổ sung STK",
      "Chủ thẻ",
      "Swift Code",
      "IBAN",
      "File thông báo mở TK",
    ],
    [],
  );

  const resolveBankList = useCallback(
    (bankList: BankAccount[] | undefined) => {
      if (!bankList) return [];
      return bankList.map((bank) => {
        const countryMatch = countries?.find(
          (c: any) =>
            c.id === bank.countryId ||
            c.id?.toString() === bank.countryId?.toString(),
        );
        const regionMatch = regions?.find(
          (r: any) =>
            r.id === bank.regionId ||
            r.id?.toString() === bank.regionId?.toString(),
        );
        const bankMatch = banks?.find(
          (b: any) =>
            b.id === bank.bankId ||
            b.id?.toString() === bank.bankId?.toString(),
        );
        const branchMatch = bankBranches?.find(
          (bb: any) =>
            bb.id === bank.bankBranchId ||
            bb.id?.toString() === bank.bankBranchId?.toString(),
        );

        return {
          ...bank,
          countryName: countryMatch
            ? countryMatch.name
            : bank.countryName || "---",
          regionName: regionMatch ? regionMatch.name : bank.regionName || "---",
          bankName: bankMatch ? bankMatch.name : bank.bankName || "---",
          bankBranchName: branchMatch
            ? branchMatch.name
            : bank.bankBranchName || "---",
        };
      });
    },
    [countries, regions, banks, bankBranches],
  );

  const oldBankListResolved = useMemo(() => {
    return resolveBankList(parsedOld?.lstBank);
  }, [parsedOld?.lstBank, resolveBankList]);

  const newBankListResolved = useMemo(() => {
    const rawNewList = detail?.jsonNew?.lstBank || parsedNew?.lstBank;
    return resolveBankList(rawNewList);
  }, [detail?.jsonNew?.lstBank, parsedNew?.lstBank, resolveBankList]);

  const oldBankRows = useMemo(() => {
    return (
      oldBankListResolved?.map((bank) => ({
        cells: [
          bank.countryName || "---",
          bank.regionName || "---",
          bank.bankName || "---",
          bank.bankBranchName || "---",
          bank.bankNumber || "---",
          bank.accountNumber || "---",
          bank.bankUsername || "---",
          bank.swiftCode || "---",
          bank.iban || "---",
          bank.fileAccount ? "File" : "---",
        ],
      })) || []
    );
  }, [oldBankListResolved]);

  const newBankRows = useMemo(() => {
    return (
      newBankListResolved.map((bank, idx) => {
        const oldBank = oldBankListResolved?.[idx];
        const isDiff = (field: keyof BankAccount) => {
          if (!oldBank) return true;
          if (field === "countryName")
            return bank.countryId !== oldBank.countryId;
          if (field === "regionName") return bank.regionId !== oldBank.regionId;
          if (field === "bankName") return bank.bankId !== oldBank.bankId;
          if (field === "bankBranchName")
            return bank.bankBranchId !== oldBank.bankBranchId;
          return bank[field] !== oldBank[field];
        };

        const renderCell = (
          field: keyof BankAccount,
          defaultVal: string = "---",
        ) => {
          const val = (bank[field] || defaultVal).toString();
          return isDiff(field)
            ? { text: val, style: { color: "red", fontWeight: "600" as const } }
            : val;
        };

        return {
          cells: [
            renderCell("countryName"),
            renderCell("regionName"),
            renderCell("bankName"),
            renderCell("bankBranchName"),
            renderCell("bankNumber"),
            renderCell("accountNumber"),
            renderCell("bankUsername"),
            renderCell("swiftCode"),
            renderCell("iban"),
            isDiff("fileAccount")
              ? {
                  text: bank.fileAccount ? "File" : "---",
                  style: {
                    color: "red",
                    fontWeight: "600" as const,
                    textDecorationLine: "underline" as const,
                  },
                }
              : {
                  text: bank.fileAccount ? "File" : "---",
                  style: bank.fileAccount
                    ? {
                        color: colors.active,
                        textDecorationLine: "underline" as const,
                      }
                    : undefined,
                },
          ],
        };
      }) || []
    );
  }, [oldBankListResolved, newBankListResolved, colors.active]);

  // --- SECTION IV: DOANH THU TRONG 5 NĂM GẦN ĐÂY ---
  const revenueColumns = useMemo(() => ["Năm", "Doanh thu"], []);

  const oldRevenueRows = useMemo(() => {
    return (
      parsedOld?.revenueHistory?.map((rev) => ({
        cells: [
          rev.year || "---",
          rev.revenue ? Number(rev.revenue).toLocaleString("vi-VN") : "---",
        ],
      })) || []
    );
  }, [parsedOld?.revenueHistory]);

  const newRevenueRows = useMemo(() => {
    return (
      parsedNew?.revenueHistory?.map((rev, idx) => {
        const oldRev = parsedOld?.revenueHistory?.[idx];
        const isDiff = (field: keyof RevenueHistory) => {
          if (!oldRev) return true;
          return rev[field] !== oldRev[field];
        };

        const renderCell = (
          field: keyof RevenueHistory,
          defaultVal: string = "---",
        ) => {
          const val = rev[field]?.toString() || defaultVal;
          if (field === "revenue" && rev.revenue) {
            const formattedVal = Number(rev.revenue).toLocaleString("vi-VN");
            return isDiff(field)
              ? {
                  text: formattedVal,
                  style: { color: "red", fontWeight: "600" as const },
                }
              : formattedVal;
          }
          return isDiff(field)
            ? { text: val, style: { color: "red", fontWeight: "600" as const } }
            : val;
        };

        return {
          cells: [renderCell("year"), renderCell("revenue")],
        };
      }) || []
    );
  }, [parsedOld?.revenueHistory, parsedNew?.revenueHistory]);

  // --- ACTION BUTTON HANDLERS ---
  const canApprove = detail?.canApprove;

  const handleApprove = useCallback(() => {
    if (!detail) return;
    show({
      title: "Xác nhận duyệt",
      message: "Bạn có chắc chắn muốn duyệt yêu cầu này?",
      confirmText: "Duyệt",
      cancelText: "Hủy",
      onConfirm: () => {
        approveMutation.mutate(
          {
            requestUpdateSupplierId: detail.id,
            supplierId: detail.supplierId,
            jsonLaw: detail.newJson,
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Duyệt thành công" });
              goBack();
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Duyệt thất bại",
              });
            },
          },
        );
      },
      onCancel: () => {
        hide();
      },
    });
  }, [detail, approveMutation, show, hide, showToast]);

  const handleReject = useCallback(() => {
    if (!detail) return;
    show({
      title: "Xác nhận từ chối",
      message: "Bạn có chắc chắn muốn từ chối phiếu chỉnh sửa này?",
      confirmText: "Từ chối",
      cancelText: "Hủy",
      onConfirm: () => {
        rejectMutation.mutate(
          {
            id: detail.id,
            status: SupplierLawStatus.CANCEL,
            supplierId: detail.supplierId,
            level: detail.level,
            type: "RUSL",
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Từ chối thành công" });
              goBack();
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Từ chối thất bại",
              });
            },
          },
        );
      },
      onCancel: () => {
        hide();
      },
    });
  }, [detail, rejectMutation, show, hide, showToast]);

  if (loading && !detail) {
    return (
      <Linear>
        <Header title={"Chi tiết - " + (item?.code || "---")} showBack />
        <Container disableInsetBottom={true}>
          <SupplierLawDetailSkeleton />
        </Container>
      </Linear>
    );
  }

  const displayCode = detail?.code || item?.code || "---";

  return (
    <Linear>
      <Header
        title={"Chi tiết - " + displayCode}
        subTitle="Chỉnh sửa pháp lý"
        showBack
      />

      <Container disableInsetBottom={true}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyle.scrollContainerDetail}
        >
          {/* I. THÔNG TIN CHUNG */}
          <Collapse title="I. Thông tin nhà cung cấp" collapsible>
            <Table
              horizontalScroll
              columns={[
                "Tên nội dung",
                "Nội dung sau khi điều chỉnh",
                "Nội dung trước khi điều chỉnh",
              ]}
              rows={generalRows}
              columnWidths={[200, 300, 300]}
              columnAlignments={["left", "left", "left"]}
              columnTextAlignments={["left", "left", "left"]}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          {/* II. NGƯỜI ĐẠI DIỆN PHÁP LÝ */}
          <Collapse title="II. Người đại diện pháp lý" collapsible>
            <Text bold size={14}>
              Danh sách cũ
            </Text>
            <Spacer size={8} />
            <Table
              horizontalScroll
              columns={legalRepColumns}
              rows={oldLegalRepRows}
              columnWidths={[
                50, 150, 120, 120, 100, 150, 100, 120, 120, 120, 150,
              ]}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14}>
              Danh sách mới
            </Text>
            <Spacer size={8} />
            <Table
              horizontalScroll
              columns={legalRepColumns}
              rows={newLegalRepRows}
              columnWidths={[
                50, 150, 120, 120, 100, 150, 100, 120, 120, 120, 150,
              ]}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          {/* III. DANH SÁCH NGÂN HÀNG */}
          <Collapse title="III. Danh sách ngân hàng" collapsible>
            <Text bold size={14}>
              Danh sách cũ
            </Text>
            <Spacer size={8} />
            <Table
              horizontalScroll
              columns={bankColumns}
              rows={oldBankRows}
              columnWidths={[180, 150, 180, 200, 180, 180, 150, 130, 130, 150]}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14}>
              Danh sách mới
            </Text>
            <Spacer size={8} />
            <Table
              horizontalScroll
              columns={bankColumns}
              rows={newBankRows}
              columnWidths={[180, 150, 180, 200, 180, 180, 150, 130, 130, 150]}
              onRowDoublePress={(index) => {
                const item = newBankListResolved[index];
                if (!item) return;
                openSheet(() => <SupplierLawBankDetailSheet item={item} />);
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          {/* IV. DOANH THU 5 NĂM */}
          <Collapse title="IV. Doanh thu trong 5 năm gần đây" collapsible>
            <Text bold size={14}>
              Danh sách cũ
            </Text>
            <Spacer size={8} />
            <Table
              columns={revenueColumns}
              rows={oldRevenueRows}
              columnFlexValues={[1, 1]}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14}>
              Danh sách mới
            </Text>
            <Spacer size={8} />
            <Table
              columns={revenueColumns}
              rows={newRevenueRows}
              columnFlexValues={[1, 1]}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          {/* V. LÝ DO ĐIỀU CHỈNH */}
          <Collapse title="V. Lý do điều chỉnh" collapsible>
            <Text size={14} color={colors.text}>
              {detail?.reasonUpdate || "---"}
            </Text>
            {detail?.fileAttachment && (
              <View
                style={[
                  styles.fileContainer,
                  {
                    backgroundColor: (colors.info as string) + "10",
                    borderColor: colors.info as string,
                  },
                ]}
              >
                <Text
                  size={13}
                  color={colors.active}
                  bold
                  style={{ textDecorationLine: "underline" }}
                >
                  Xem file đính kèm
                </Text>
              </View>
            )}
          </Collapse>
        </ScrollView>
      </Container>

      {canApprove && (
        <ApprovalButton
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </Linear>
  );
};

export default SupplierLawDetail;

const styles = StyleSheet.create({
  fileContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
  },
});
