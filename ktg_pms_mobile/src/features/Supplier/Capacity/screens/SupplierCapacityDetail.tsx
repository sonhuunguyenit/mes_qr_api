import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Collapse,
  Container,
  Header,
  Linear,
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
import { CapacityJson } from "~/services/supplier/supplier-capacity.type";
import { goBack } from "~/utils/navigate";
import SupplierCapacityDetailSkeleton from "../components/SupplierCapacityDetailSkeleton";
import { useSupplierCapacity } from "../hooks/useSupplierCapacity";
import globalStyle from "~/styles/global-style";
import { useSheet } from "~/contexts/SheetContext";
import { SupplierCapacityGeneralDetailSheet } from "../sheets/SupplierCapacityGeneralDetailSheet";
import { SupplierCapacityProductDetailSheet } from "../sheets/SupplierCapacityProductDetailSheet";
import { SupplierCapacityFacilityDetailSheet } from "../sheets/SupplierCapacityFacilityDetailSheet";
import { SupplierCapacityProductionLineDetailSheet } from "../sheets/SupplierCapacityProductionLineDetailSheet";
import { SupplierCapacityCertificationDetailSheet } from "../sheets/SupplierCapacityCertificationDetailSheet";

type Props = NativeStackScreenProps<
  AppNavigatorParamList,
  typeof ROUTE_KEYS.SupplierCapacityDetail
>;

const SupplierCapacityDetail = ({ route }: Props) => {
  const { colors } = useTheme();
  const { useCapacityDetail, useApprove, useReject } = useSupplierCapacity();
  const { show, hide } = useModal();
  const { openSheet } = useSheet();
  const { showToast } = useToast();
  const item = route.params?.item;

  const { data: detail, isLoading: loading } = useCapacityDetail(item?.id);
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const safeParse = (json?: string): CapacityJson => {
    try {
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  };

  const parsedOld = useMemo(
    () => safeParse(detail?.oldJson),
    [detail?.oldJson],
  );
  const parsedNew = useMemo(
    () => safeParse(detail?.newJson),
    [detail?.newJson],
  );

  const generalRows = useMemo(() => {
    const fieldMap: { key: keyof CapacityJson; label: string }[] = [
      { key: "paymentMethodName", label: "Phương thức thanh toán" },
      { key: "paymentTermName", label: "Thời hạn thanh toán" },
      { key: "decider", label: "Người quyết định" },
      { key: "deciderPosition", label: "Chức vụ người quyết định" },
      { key: "deciderPhone", label: "Số điện thoại người quyết định" },
      { key: "deciderFax", label: "Số Fax người quyết định" },
      { key: "deciderEmail", label: "Email người quyết định" },
      { key: "deciderNote", label: "Lưu ý về người quyết định" },
      { key: "trader", label: "Người giao dịch" },
      { key: "traderPosition", label: "Chức vụ người giao dịch" },
      { key: "traderPhone", label: "Số điện thoại người giao dịch" },
      { key: "traderFax", label: "Số Fax người giao dịch" },
      { key: "traderEmail", label: "Email người giao dịch" },
      { key: "traderNote", label: "Lưu ý về người giao dịch" },
    ];

    return fieldMap.map(({ key, label }) => {
      const oldVal = (parsedOld as any)[key] || "---";
      const newVal = (parsedNew as any)[key] || "---";
      const isChanged = oldVal !== newVal;

      return {
        cells: [
          label,
          {
            text: newVal.toString(),
            style: { color: isChanged ? colors.error : colors.text },
          },
          oldVal.toString(),
        ],
      };
    });
  }, [parsedOld, parsedNew, colors]);

  const productData = useMemo(() => {
    const newItems = parsedNew?.lstProductService || [];
    const oldItems = parsedOld?.lstProductService || [];

    const newRows = newItems.map((newItem, i) => {
      const oldItem = oldItems[i];
      const newCap =
        newItem?.supplyCapacityPerMonth1 ||
        newItem?.supplyCapacityPerMonth ||
        "---";
      const oldCap =
        oldItem?.supplyCapacityPerMonth1 ||
        oldItem?.supplyCapacityPerMonth ||
        "---";

      return {
        cells: [
          {
            text: newItem?.name || "---",
            style: {
              color:
                newItem?.name !== oldItem?.name ? colors.error : colors.text,
            },
          },
          {
            text: newCap.toString(),
            style: { color: newCap !== oldCap ? colors.error : colors.text },
          },
        ],
      };
    });

    const oldRows = oldItems.map((oldItem) => {
      const cap =
        oldItem?.supplyCapacityPerMonth1 ||
        oldItem?.supplyCapacityPerMonth ||
        "---";
      return { cells: [oldItem?.name || "---", cap.toString()] };
    });

    return { newRows, oldRows };
  }, [parsedNew?.lstProductService, parsedOld?.lstProductService, colors]);

  const facilityData = useMemo(() => {
    const newItems = parsedNew?.facilities || [];
    const oldItems = parsedOld?.facilities || [];
    const fields = [
      "name",
      "totalAreaM2",
      "avgWorkHour",
      "officeAreaM2",
      "productionAreaM2",
      "rawMaterialAreaM2",
      "finishedGoodsAreaM2",
    ];

    const newRows = newItems.map((newItem, i) => {
      const oldItem = oldItems[i] || {};
      return {
        cells: fields.map((f) => {
          const val = (newItem as any)[f]?.toString() || "---";
          const isChanged = (newItem as any)[f] !== (oldItem as any)?.[f];
          return {
            text: val,
            style: { color: isChanged ? colors.error : colors.text },
          };
        }),
      };
    });

    const oldRows = oldItems.map((oldItem) => ({
      cells: fields.map((f) => (oldItem as any)[f]?.toString() || "---"),
    }));

    return { newRows, oldRows };
  }, [parsedNew?.facilities, parsedOld?.facilities, colors]);

  const productionLineData = useMemo(() => {
    const newItems = parsedNew?.lstProductionLine || [];
    const oldItems = parsedOld?.lstProductionLine || [];
    const fields = [
      "step",
      "equipmentName",
      "quantity",
      "commissioningYear",
      "designCapacity",
      "actualCapacity",
    ];

    const newRows = newItems.map((newItem, i) => {
      const oldItem = oldItems[i] || {};
      return {
        cells: fields.map((f) => {
          let val = (newItem as any)[f]?.toString() || "---";
          if (f === "commissioningYear" && val !== "---") {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
              val = date.getFullYear().toString();
            }
          }
          const isChanged = (newItem as any)[f] !== (oldItem as any)?.[f];
          return {
            text: val,
            style: { color: isChanged ? colors.error : colors.text },
          };
        }),
      };
    });

    const oldRows = oldItems.map((oldItem) => ({
      cells: fields.map((f) => {
        let val = (oldItem as any)[f]?.toString() || "---";
        if (f === "commissioningYear" && val !== "---") {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            val = date.getFullYear().toString();
          }
        }
        return val;
      }),
    }));

    return { newRows, oldRows };
  }, [parsedNew?.lstProductionLine, parsedOld?.lstProductionLine, colors]);

  const certificationData = useMemo(() => {
    const newItems = parsedNew?.lstCertification || [];
    const oldItems = parsedOld?.lstCertification || [];

    const newRows = newItems.map((newItem, i) => {
      const oldItem = oldItems[i];
      const isNameChanged = newItem?.name !== oldItem?.name;
      const isFileChanged = newItem?.fileAttachment !== oldItem?.fileAttachment;

      return {
        cells: [
          {
            text: newItem?.name || "---",
            style: { color: isNameChanged ? colors.error : colors.text },
          },
          {
            text: newItem?.fileAttachment ? "Xem file" : "---",
            style: {
              color: isFileChanged ? colors.error : colors.active,
              textDecorationLine: "underline" as const,
            },
          },
        ],
      };
    });

    const oldRows = oldItems.map((oldItem) => ({
      cells: [
        oldItem?.name || "---",
        {
          text: oldItem?.fileAttachment ? "Xem file" : "---",
          style: {
            color: colors.active,
            textDecorationLine: "underline" as const,
          },
        },
      ],
    }));

    return { newRows, oldRows };
  }, [parsedNew?.lstCertification, parsedOld?.lstCertification, colors]);

  const canApprove = useMemo(() => {
    const status = String(detail?.status || "").toUpperCase();
    const isPending = [
      "WAIT_APPROVE",
      "WAITAPPROVE",
      "PENDING",
      "INREVIEW",
    ].includes(status);

    return (
      isPending &&
      (detail?.canApprove || (detail?.objPermissionApprove?.RUSC ?? false))
    );
  }, [detail?.status, detail?.objPermissionApprove?.RUSC, detail?.canApprove]);

  const handleApprove = useCallback(() => {
    if (!detail) return;
    show({
      style: {
        width: 340,
      },
      component: (
        <Status
          type="accept"
          title="Phê duyệt"
          message="Bạn có chắc chắn muốn duyệt phiếu điều chỉnh năng lực này?"
        />
      ),
      onConfirm: () => {
        approveMutation.mutate(
          {
            requestUpdateSupplierId: detail.id,
            supplierId: detail.supplierId,
            jsonCapacity: detail.jsonCapacity || detail.newJson,
          },
          {
            onSuccess: () => {
              showToast({ type: "success", message: "Phê duyệt thành công" });
              goBack();
            },
            onError: (error: any) => {
              showToast({
                type: "danger",
                message: error?.message || "Phê duyệt thất bại",
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
      style: {
        width: 340,
      },
      component: (
        <Status
          type="refuse"
          title="Từ chối"
          message="Bạn có chắc chắn muốn từ chối phiếu điều chỉnh năng lực này?"
        />
      ),
      onConfirm: () => {
        rejectMutation.mutate(
          {
            id: detail.id,
            status: SupplierLawStatus.CANCEL,
            supplierId: detail.supplierId,
            level: detail.level,
            type: "RUSC",
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
        <Header title="Duyệt phiếu" subTitle="Chỉnh sửa năng lực" showBack />
        <Container>
          <SupplierCapacityDetailSkeleton />
        </Container>
      </Linear>
    );
  }

  return (
    <Linear>
      <Header title={"Duyệt phiếu"} subTitle="Chỉnh sửa năng lực" showBack />

      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyle.scrollContainerDetail}
        >
          <Collapse title="I. Nội dung điều chỉnh" collapsible>
            <Table
              columns={[
                "Tên nội dung",
                "Nội dung sau khi điều chỉnh",
                "Nội dung trước khi điều chỉnh",
              ]}
              rows={generalRows}
              columnFlexValues={[1, 1, 1]}
              onRowDoublePress={(index) => {
                const key = [
                  "paymentMethodName",
                  "paymentTermName",
                  "decider",
                  "deciderPosition",
                  "deciderPhone",
                  "deciderFax",
                  "deciderEmail",
                  "deciderNote",
                  "trader",
                  "traderPosition",
                  "traderPhone",
                  "traderFax",
                  "traderEmail",
                  "traderNote",
                ][index];
                const labels = [
                  "Phương thức thanh toán",
                  "Thời hạn thanh toán",
                  "Người quyết định",
                  "Chức vụ người quyết định",
                  "Số điện thoại người quyết định",
                  "Số Fax người quyết định",
                  "Email người quyết định",
                  "Lưu ý về người quyết định",
                  "Người giao dịch",
                  "Chức vụ người giao dịch",
                  "Số điện thoại người giao dịch",
                  "Số Fax người giao dịch",
                  "Email người giao dịch",
                  "Lưu ý về người giao dịch",
                ];
                openSheet(() => (
                  <SupplierCapacityGeneralDetailSheet
                    item={{
                      label: labels[index],
                      newVal: (parsedNew as any)[key] || "---",
                      oldVal: (parsedOld as any)[key] || "---",
                    }}
                  />
                ));
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          <Collapse
            title="II. Sản phẩm và dịch vụ NCC sản xuất/kinh doanh"
            collapsible
          >
            <Text bold size={14} color={colors.text}>
              Danh sách mới
            </Text>
            <Spacer size={5} />
            <Table
              columns={["Tên", "Năng lực CC/tháng"]}
              rows={productData.newRows}
              columnFlexValues={[1, 1]}
              onRowDoublePress={(index) => {
                const item = parsedNew?.lstProductService?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityProductDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14} color={colors.text}>
              Danh sách cũ
            </Text>
            <Spacer size={5} />
            <Table
              columns={["Tên", "Năng lực CC/tháng"]}
              rows={productData.oldRows}
              columnFlexValues={[1, 1]}
              onRowDoublePress={(index) => {
                const item = parsedOld?.lstProductService?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityProductDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          <Collapse title="III. Nhà xưởng và thiết bị" collapsible>
            <Text bold size={14} color={colors.text}>
              Danh sách mới
            </Text>
            <Spacer size={5} />
            <Table
              horizontalScroll
              columns={[
                "Tên",
                "Tổng diện tích (m2)",
                "Số giờ làm việc TB",
                "DT Văn phòng (m2)",
                "DT Sản xuất (m2)",
                "DT Kho NVL (m2)",
                "DT Kho thành phẩm (m2)",
              ]}
              rows={facilityData.newRows}
              columnWidths={[150, 120, 120, 130, 130, 130, 130]}
              onRowDoublePress={(index) => {
                const item = parsedNew?.facilities?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityFacilityDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14} color={colors.text}>
              Danh sách cũ
            </Text>
            <Spacer size={5} />
            <Table
              horizontalScroll
              columns={[
                "Tên",
                "Tổng diện tích (m2)",
                "Số giờ làm việc TB",
                "DT Văn phòng (m2)",
                "DT Sản xuất (m2)",
                "DT Kho NVL (m2)",
                "DT Kho thành phẩm (m2)",
              ]}
              rows={facilityData.oldRows}
              columnWidths={[150, 120, 120, 130, 130, 130, 130]}
              onRowDoublePress={(index) => {
                const item = parsedOld?.facilities?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityFacilityDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          <Collapse
            title="IV. Trang thiết bị theo dây chuyền sản xuất"
            collapsible
          >
            <Text bold size={14} color={colors.text}>
              Danh sách mới
            </Text>
            <Spacer size={5} />
            <Table
              horizontalScroll
              columns={[
                "Bước quy trình SX",
                "Tên thiết bị",
                "Số lượng VH",
                "Năm sử dụng",
                "Công suất thiết kế",
                "Công suất thực tế",
              ]}
              rows={productionLineData.newRows}
              columnWidths={[120, 150, 100, 100, 120, 120]}
              onRowDoublePress={(index) => {
                const item = parsedNew?.lstProductionLine?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityProductionLineDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14} color={colors.text}>
              Danh sách cũ
            </Text>
            <Spacer size={5} />
            <Table
              horizontalScroll
              columns={[
                "Bước quy trình SX",
                "Tên thiết bị",
                "Số lượng VH",
                "Năm sử dụng",
                "Công suất thiết kế",
                "Công suất thực tế",
              ]}
              rows={productionLineData.oldRows}
              columnWidths={[120, 150, 100, 100, 120, 120]}
              onRowDoublePress={(index) => {
                const item = parsedOld?.lstProductionLine?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityProductionLineDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          <Collapse title="V. Chứng nhận ISO 9000 hoặc tương đương" collapsible>
            <Text bold size={14} color={colors.text}>
              Danh sách mới
            </Text>
            <Spacer size={5} />
            <Table
              columns={["Tên", "File đính kèm"]}
              rows={certificationData.newRows}
              columnFlexValues={[2, 1]}
              onRowDoublePress={(index) => {
                const item = parsedNew?.lstCertification?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityCertificationDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
            <Spacer size={15} />
            <Text bold size={14} color={colors.text}>
              Danh sách cũ
            </Text>
            <Spacer size={5} />
            <Table
              columns={["Tên", "File đính kèm"]}
              rows={certificationData.oldRows}
              columnFlexValues={[2, 1]}
              onRowDoublePress={(index) => {
                const item = parsedOld?.lstCertification?.[index];
                if (!item) return;
                openSheet(() => (
                  <SupplierCapacityCertificationDetailSheet item={item} />
                ));
              }}
              pagination={{ enabled: false }}
            />
          </Collapse>

          <Spacer size={10} />

          <Collapse title="VI. Lý do điều chỉnh" collapsible>
            <Text size={14} color={colors.text}>
              {detail?.reasonUpdate || "---"}
            </Text>
            {detail?.fileAttachment && (
              <View
                style={[
                  styles.fileContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.divider,
                  },
                ]}
              >
                <Text size={12} color={colors.text} style={{ marginBottom: 4 }}>
                  File đính kèm:
                </Text>
                <Text
                  size={13}
                  color={colors.active}
                  bold
                  style={{ textDecorationLine: "underline" }}
                >
                  Xem file
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

export default SupplierCapacityDetail;

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
