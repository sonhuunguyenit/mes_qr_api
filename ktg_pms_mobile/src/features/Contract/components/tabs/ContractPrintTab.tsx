import * as FileSystem from "expo-file-system";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Share, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  Button,
  Column,
  Empty,
  Input,
  Row,
  SelectSheet,
  Spacer,
  Text,
} from "~/common";
import { CONFIG } from "~/constants/config";
import { STORAGE_KEYS } from "~/constants/storage";
import { ContractStatus } from "~/enums/contract.enum";
import { useTheme } from "~/hooks/useTheme";
import { useToast } from "~/hooks/useToast";
import { contractService } from "~/services/contract/contract.service";
import { ContractDetail, TemplateDto } from "~/services/contract/contract.type";
import globalStyle from "~/styles/global-style";
import SecureHelper from "~/utils/storage";
import {
  generateContractHtml,
  templateKeyFieldLabelMap,
  templateKeyFieldMap,
  templateKeySelectOptionsMap,
  templateKeyTypeMap,
} from "../templates";

interface ContractPrintTabProps {
  detail: ContractDetail;
  refetch: () => void;
  activeTab: number;
}

export const ContractPrintTab = ({
  detail,
  refetch,
  activeTab,
}: ContractPrintTabProps) => {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [templatesList, setTemplatesList] = useState<TemplateDto[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [missingKeysMap, setMissingKeysMap] = useState<any[]>([]);
  const [missingValues, setMissingValues] = useState<Record<string, any>>({});
  const [isSavingMissing, setIsSavingMissing] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Fetch templates list when tab is focused
  useEffect(() => {
    if (activeTab === 1) {
      contractService
        .getTemplates("Contract")
        .then((res) => {
          if (res?.data && res.data.length > 0) {
            setTemplatesList(res.data);
          } else {
            // Static backup templates mirroring database
            setTemplatesList([
              {
                id: "TEMPLATE_1",
                name: "TEMPLATE_1 (Hợp đồng nguyên tắc với FWD)",
              },
              { id: "TEMPLATE_2", name: "TEMPLATE_2 (Hợp đồng NT nPL)" },
              {
                id: "TEMPLATE_3",
                name: "TEMPLATE_3 (Principle contract English)",
              },
              {
                id: "TEMPLATE_4",
                name: "TEMPLATE_4 (Hợp đồng mua bán hàng hóa)",
              },
              { id: "TEMPLATE_5", name: "TEMPLATE_5 (Hợp đồng thương mại)" },
              {
                id: "TEMPLATE_6",
                name: "TEMPLATE_6 (Hợp đồng dịch vụ tổng hợp)",
              },
            ]);
          }
        })
        .catch(() => {
          setTemplatesList([
            {
              id: "TEMPLATE_1",
              name: "TEMPLATE_1 (Hợp đồng nguyên tắc với FWD)",
            },
            { id: "TEMPLATE_2", name: "TEMPLATE_2 (Hợp đồng NT nPL)" },
            {
              id: "TEMPLATE_3",
              name: "TEMPLATE_3 (Principle contract English)",
            },
            {
              id: "TEMPLATE_4",
              name: "TEMPLATE_4 (Hợp đồng mua bán hàng hóa)",
            },
            {
              id: "TEMPLATE_5",
              name: "TEMPLATE_5 (Hợp đồng dịch vụ tổng hợp)",
            },
            { id: "TEMPLATE_6", name: "TEMPLATE_6 (Hợp đồng thương mại)" },
          ]);
        });
    }
  }, [activeTab]);

  // Default to contract's saved template ID if exists
  useEffect(() => {
    if (detail?.templateId) {
      setSelectedTemplateId(detail.templateId);
    }
  }, [detail?.templateId]);

  // Load missing keys when template changes
  useEffect(() => {
    if (!selectedTemplateId) {
      setMissingKeysMap([]);
      return;
    }

    contractService
      .getTemplateKeys(selectedTemplateId)
      .then((res) => {
        const keysInTemplate = res.data || [];
        const keysInTemplateMap = Object.entries(templateKeyFieldMap)
          .filter(([key]) => keysInTemplate.includes(key))
          .map(([key, field]) => ({ key, field }));

        const missingKeys = keysInTemplateMap.map(({ key, field }) => {
          const type = templateKeyTypeMap[key] || "text";
          const savedValue = detail?.[field as keyof ContractDetail];

          return {
            key,
            field,
            value: type === "checkbox" ? !!savedValue : (savedValue ?? ""),
            type,
            options: templateKeySelectOptionsMap[key] || [],
          };
        });

        setMissingKeysMap(missingKeys);

        // Initialize form values from detail
        const initialValues: Record<string, any> = {};
        missingKeys.forEach((item) => {
          initialValues[item.field] = item.value;
        });
        setMissingValues(initialValues);
      })
      .catch((err) => {
        console.log("Error loading template keys:", err);
        setMissingKeysMap([]);
      });
  }, [selectedTemplateId, detail]);

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    try {
      const contractId = detail?.id;
      if (contractId && templateId) {
        await contractService.saveTemplate({ contractId, templateId });
        showToast({
          type: "success",
          message: "Lưu mẫu hợp đồng thành công!",
        });
        refetch();
      }
    } catch (err: any) {
      showToast({
        type: "danger",
        message: err?.response?.data?.message || "Không thể lưu mẫu hợp đồng",
      });
    }
  };

  const handleFieldChange = (field: string, val: any) => {
    setMissingValues((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSaveMissingFields = async () => {
    setIsSavingMissing(true);
    try {
      const updatedDetail = {
        ...detail,
        ...missingValues,
      };
      await contractService.updateMissingInfo(updatedDetail);
      showToast({
        type: "success",
        message: "Cập nhật thông tin thành công!",
      });
      refetch();
    } catch (err: any) {
      showToast({
        type: "danger",
        message: err?.response?.data?.message || "Không thể lưu thông tin",
      });
    } finally {
      setIsSavingMissing(false);
    }
  };

  const handleSharePdf = async (uri: string) => {
    try {
      await Share.share({
        url: uri,
        title: "Hợp đồng PDF",
      });
    } catch (err) {
      console.log("Error sharing PDF:", err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedTemplateId) {
      showToast({
        type: "warning",
        message: "Vui lòng chọn mẫu hợp đồng để in",
      });
      return;
    }

    setIsDownloadingPdf(true);
    try {
      const token = await SecureHelper.get(STORAGE_KEYS.ACCESS_TOKEN);
      const pdfUrl = `${CONFIG.API_URL}/template/render-pdf`;

      const codeStr =
        detail?.foreignContractCode || detail?.contractNumber || "contract";
      const localUri = `${FileSystem.documentDirectory}Hop_dong_${codeStr}.pdf`;

      const isDraft =
        detail?.status !== ContractStatus.PROCESSING &&
        detail?.status !== ContractStatus.DONE;
      const htmlContent = generateContractHtml(
        selectedTemplateId,
        detail,
        isDraft,
      );

      const payload = {
        html: htmlContent,
        foreignContractCode: detail?.foreignContractCode || "",
        date: detail?.contractDate || detail?.effectiveDate || "",
        createdBy: detail?.companyName || "",
        contractType: detail?.contractType || "",
      };

      const response = await fetch(pdfUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const blob = await response.blob();

        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64data = (reader.result as string).split(",")[1];
              await FileSystem.writeAsStringAsync(localUri, base64data, {
                encoding: FileSystem.EncodingType.Base64,
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => {
            reject(new Error("FileReader failed"));
          };
          reader.readAsDataURL(blob);
        });

        setIsDownloadingPdf(false);

        showToast({
          type: "success",
          message: "Tải file PDF hợp đồng thành công!",
        });

        Alert.alert(
          "Thành công",
          "Đã tải file PDF hợp đồng. Bạn có muốn chia sẻ hoặc mở file không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Chia sẻ",
              onPress: () => handleSharePdf(localUri),
            },
          ],
        );
      } else {
        throw new Error(`Mã lỗi HTTP: ${response.status}`);
      }
    } catch (err: any) {
      setIsDownloadingPdf(false);
      console.log("Error exporting PDF:", err);
      showToast({
        type: "danger",
        message: "Không thể xuất bản in PDF. Vui lòng thử lại.",
      });
    }
  };

  const templateOptions = useMemo(() => {
    return templatesList.map((t) => ({
      label: t.name || t.id,
      value: t.id,
    }));
  }, [templatesList]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        globalStyle.scrollContainerDetail,
        { paddingBottom: 40 },
      ]}
    >
      {/* Template Selector Card */}
      <View style={[styles.printCard, { borderColor: colors.border }]}>
        <Text size={15} color={colors.title} bold style={{ marginBottom: 12 }}>
          Chọn mẫu in hợp đồng
        </Text>
        <SelectSheet
          options={templateOptions}
          value={selectedTemplateId}
          onChange={handleSelectTemplate}
          placeholder="Chọn mẫu in hợp đồng..."
        />
      </View>

      <Spacer size={15} />

      {/* Dynamic Missing Keys Form Card */}
      {selectedTemplateId !== "" && missingKeysMap.length > 0 && (
        <View style={[styles.printCard, { borderColor: colors.border }]}>
          <Text size={15} color="#D97706" bold style={{ marginBottom: 12 }}>
            ⚠️ THÔNG TIN CÒN THIẾU TRÊN MẪU IN
          </Text>

          <Column style={{ gap: 14 }}>
            {missingKeysMap.map((missing) => {
              const label =
                templateKeyFieldLabelMap[missing.key] || missing.key;

              return (
                <View key={missing.key} style={styles.formGroup}>
                  <Text
                    size={13}
                    color="#64748B"
                    bold
                    style={{ marginBottom: 6 }}
                  >
                    {label}
                  </Text>

                  {missing.type === "select" ? (
                    <SelectSheet
                      options={missing.options.map((opt: string) => ({
                        label: opt,
                        value: opt,
                      }))}
                      value={missingValues[missing.field] ?? ""}
                      onChange={(val) => handleFieldChange(missing.field, val)}
                      placeholder={`Chọn ${label.toLowerCase()}...`}
                    />
                  ) : missing.type === "checkbox" ? (
                    <SelectSheet
                      options={[
                        { label: "Có / Đồng ý", value: true },
                        { label: "Không / Từ chối", value: false },
                      ]}
                      value={missingValues[missing.field]}
                      onChange={(val) => handleFieldChange(missing.field, val)}
                      placeholder={`Chọn trạng thái...`}
                    />
                  ) : missing.type === "textarea" ? (
                    <Input
                      placeholder={`Nhập ${label.toLowerCase()}...`}
                      value={String(missingValues[missing.field] ?? "")}
                      onChangeText={(text: string) =>
                        handleFieldChange(missing.field, text)
                      }
                      multiline
                      numberOfLines={3}
                      style={styles.textAreaInput}
                    />
                  ) : (
                    <Input
                      placeholder={`Nhập ${label.toLowerCase()}...`}
                      value={String(missingValues[missing.field] ?? "")}
                      onChangeText={(text: string) =>
                        handleFieldChange(missing.field, text)
                      }
                      keyboardType={
                        missing.type === "number" ? "numeric" : "default"
                      }
                    />
                  )}
                </View>
              );
            })}

            <Spacer size={5} />

            <Button
              title="Cập nhật thông tin"
              onPress={handleSaveMissingFields}
              loading={isSavingMissing}
              buttonStyle={{
                backgroundColor: colors.active,
                borderColor: colors.active,
                height: 48,
              }}
              titleStyle={{ color: colors.white, fontWeight: "600" }}
            />
          </Column>
        </View>
      )}

      {selectedTemplateId !== "" && missingKeysMap.length > 0 && (
        <Spacer size={15} />
      )}

      {/* Print Preview Container */}
      {selectedTemplateId !== "" ? (
        <View style={[styles.printCard, { borderColor: colors.border }]}>
          <Row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text size={15} color={colors.title} bold>
              XEM TRƯỚC BẢN IN (A4)
            </Text>
            {detail?.status !== ContractStatus.PROCESSING &&
              detail?.status !== ContractStatus.DONE && (
                <View
                  style={{
                    backgroundColor: "#FEE2E2",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#FCA5A5",
                  }}
                >
                  <Text size={12} color="#EF4444" bold>
                    BẢN NHÁP
                  </Text>
                </View>
              )}
          </Row>

          <View
            style={[styles.webViewContainer, { borderColor: colors.border }]}
          >
            <WebView
              originWhitelist={["*"]}
              source={{
                html: generateContractHtml(
                  selectedTemplateId,
                  detail,
                  detail?.status !== ContractStatus.PROCESSING &&
                    detail?.status !== ContractStatus.DONE,
                ),
              }}
              style={styles.webView}
              scalesPageToFit={true}
              scrollEnabled={true}
            />
          </View>

          <Spacer size={15} />

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Button
                title="Tải PDF"
                onPress={handleDownloadPdf}
                loading={isDownloadingPdf}
                buttonStyle={{
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                  height: 48,
                }}
                titleStyle={{ color: colors.white, fontWeight: "600" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Chia sẻ"
                onPress={() => {
                  const isDraft =
                    detail?.status !== ContractStatus.PROCESSING &&
                    detail?.status !== ContractStatus.DONE;
                  const codeStr =
                    detail?.foreignContractCode ||
                    detail?.contractNumber ||
                    "contract";
                  const localUri = `${FileSystem.documentDirectory}Hop_dong_${codeStr}.pdf`;
                  FileSystem.getInfoAsync(localUri).then((info) => {
                    if (info.exists) {
                      handleSharePdf(localUri);
                    } else {
                      handleDownloadPdf();
                    }
                  });
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  borderColor: colors.border,
                  height: 48,
                }}
                titleStyle={{ color: colors.title, fontWeight: "600" }}
              />
            </View>
          </Row>
        </View>
      ) : (
        <Empty
          title="Chưa chọn mẫu in"
          description="Vui lòng chọn một mẫu in hợp đồng ở trên để xem trước và xuất PDF."
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  printCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 4,
  },
  textAreaInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  webViewContainer: {
    height: 450,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  webView: {
    flex: 1,
  },
});
