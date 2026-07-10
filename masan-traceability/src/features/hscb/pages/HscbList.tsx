import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Upload,
  Flex,
  Progress,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { AppTable, FilterCard } from "../../../components";
import { PRIMARY_COLOR } from "../../../contants";
import {
  IpmsStatus,
  IpmsStatusConfig,
  ShttType,
  ShttTypeConfig,
} from "../../../enums";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addShttMapping,
  setShttMappingsForVersion,
} from "../../shtt/store/shttSlice";
import { addHscb, updateHscb } from "../store/hscbSlice";
import { Hscb, Hscb_Version } from "../types";
import { DocStatus } from "../../doc/types";

export const HscbList: React.FC = () => {
  const hscbs = useAppSelector((state) => state.hscb.hscbs);
  const specs = useAppSelector((state) => state.spec.specs);
  const items = useAppSelector((state) => state.item.items);
  const shttMappings = useAppSelector((state) => state.shtt.mappings);
  const ipmsInfo = useAppSelector((state) => state.shtt.ipmsInfo);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const fileUploadList = Form.useWatch("fileUpload", form);

  // Temp states for filtering
  const [tempHscbCode, setTempHscbCode] = useState("");
  const [tempSpec, setTempSpec] = useState("");
  const [tempVersionName, setTempVersionName] = useState("");
  const [tempItemType, setTempItemType] = useState<string>("ALL");
  const [tempStatus, setTempStatus] = useState<string>("ALL");
  const [tempApprovalStatus, setTempApprovalStatus] = useState<string>("ALL");

  // Active search states
  const [searchHscbCode, setSearchHscbCode] = useState("");
  const [searchSpec, setSearchSpec] = useState("");
  const [searchVersionName, setSearchVersionName] = useState("");
  const [selectedItemType, setSelectedItemType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<string>("ALL");

  const handleSearch = () => {
    setSearchHscbCode(tempHscbCode);
    setSearchSpec(tempSpec);
    setSearchVersionName(tempVersionName);
    setSelectedItemType(tempItemType);
    setSelectedStatus(tempStatus);
    setSelectedApprovalStatus(tempApprovalStatus);
  };

  const handleReset = () => {
    setTempHscbCode("");
    setTempSpec("");
    setTempVersionName("");
    setTempItemType("ALL");
    setTempStatus("ALL");
    setTempApprovalStatus("ALL");
    setSearchHscbCode("");
    setSearchSpec("");
    setSearchVersionName("");
    setSelectedItemType("ALL");
    setSelectedStatus("ALL");
    setSelectedApprovalStatus("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "overwrite" | "append">(
    "create",
  );
  const [editingHscb, setEditingHscb] = useState<Hscb | null>(null);

  // AI Parsing simulation state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const fillFakeInfo = (file: any) => {
    const randomSpec = specs.filter(
      (s) => s.SpecType === "TCCS" && !s.QloneCode,
    );
    const selectedSpec =
      randomSpec.length > 0
        ? randomSpec[Math.floor(Math.random() * randomSpec.length)]
        : null;

    // Pick 1-2 random items
    const randomItems = [...items]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);
    const selectedItemCodes = randomItems.map((item) => item.ItemCode);

    const specCode = selectedSpec ? selectedSpec.SpecCode : "TCCS";
    const generatedHscbCode = `HSCB-${specCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const docNameWithoutExt =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

    const currentValues = form.getFieldsValue();
    form.setFieldsValue({
      HscbCode:
        editMode === "create" ? generatedHscbCode : currentValues.HscbCode,
      SpecId:
        editMode === "create"
          ? selectedSpec
            ? selectedSpec.SpecId
            : undefined
          : currentValues.SpecId,
      VersionName: `Bản tự công bố - ${docNameWithoutExt}`,
      ValidFrom: dayjs(),
      ValidTo: dayjs().add(3, "year"),
      itemCodes: selectedItemCodes,
      primaryBrandCode: `SHTT-PB-${dayjs().year()}-${Math.floor(10000 + Math.random() * 90000)}`,
      secondaryBrandCode: `SHTT-SB-${dayjs().year()}-${Math.floor(10000 + Math.random() * 90000)}`,
      industrialDesignCode: `SHTT-ID-${dayjs().year()}-${Math.floor(10000 + Math.random() * 90000)}`,
      additionalShtt: [
        {
          shttType: "SECONDARY_BRAND",
          shttCode: `SHTT-SB-${dayjs().year()}-ADD-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ],
    });

    message.success(
      "Đã phân rã thông tin tài liệu PDF và tự động điền thành công!",
    );
  };

  const handleAiParsing = (file: any) => {
    setIsAiLoading(true);
    setAiProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        setAiProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsAiLoading(false);
          fillFakeInfo(file);
        }, 400);
      } else {
        setAiProgress(progress);
      }
    }, 100);
  };

  // Details Modal states
  const [selectedDetailHscb, setSelectedDetailHscb] = useState<Hscb | null>(
    null,
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // PDF Drawer states
  const [selectedHscbForPdf, setSelectedHscbForPdf] = useState<Hscb | null>(
    null,
  );
  const [isPdfDrawerVisible, setIsPdfDrawerVisible] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  const handleDownloadFakePdf = () => {
    message.loading("Đang chuẩn bị tệp PDF...", 1);
    setTimeout(() => {
      message.success(
        `Tải xuống thành công tệp ${
          selectedHscbForPdf?.HscbCode || "HSCB"
        }.pdf`,
      );
    }, 1000);
  };

  const handlePrintFakePdf = () => {
    message.loading("Đang kết nối máy in...", 1);
    setTimeout(() => {
      message.success("Lệnh in đã được gửi đến máy in thành công!");
    }, 1000);
  };

  // Helper to get the latest/current version of an HSCB
  const getLatestVersion = (hscb: Hscb): Hscb_Version | undefined => {
    if (!hscb.HscbVersions || hscb.HscbVersions.length === 0) return undefined;
    const sorted = [...hscb.HscbVersions].sort((a, b) => {
      return dayjs(b.ValidFrom).unix() - dayjs(a.ValidFrom).unix();
    });
    return sorted[0];
  };

  // Helper to determine validity status
  const getVersionStatus = (version: Hscb_Version) => {
    const today = dayjs().startOf("day");
    const validFrom = dayjs(version.ValidFrom).startOf("day");
    const validTo = version.ValidTo
      ? dayjs(version.ValidTo).startOf("day")
      : null;

    if (validFrom.isAfter(today)) {
      return { text: "Chưa hiệu lực", color: "blue", status: "PENDING" };
    }
    if (validTo && validTo.isBefore(today)) {
      return { text: "Hết hiệu lực", color: "red", status: "EXPIRED" };
    }
    return { text: "Đang hiệu lực", color: "green", status: "ACTIVE" };
  };

  // Helper to format Date | string to YYYY-MM-DD
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
  };

  // Filter logic
  const filteredHscbs = hscbs.filter((hscb) => {
    const latestVersion = getLatestVersion(hscb);
    const associatedSpec = specs.find((s) => s.SpecId === hscb.SpecId);

    // 1. Mã Hồ Sơ filter
    const matchesHscbCode = hscb.HscbCode.toLowerCase().includes(
      searchHscbCode.toLowerCase(),
    );

    // 2. Tiêu chuẩn cơ sở filter
    const matchesSpec =
      !searchSpec ||
      (associatedSpec &&
        (associatedSpec.SpecCode.toLowerCase().includes(
          searchSpec.toLowerCase(),
        ) ||
          associatedSpec.SpecName.toLowerCase().includes(
            searchSpec.toLowerCase(),
          )));

    // 3. Phiên Bản Hiện Hành filter
    const matchesVersionName =
      !searchVersionName ||
      (latestVersion &&
        latestVersion.VersionName.toLowerCase().includes(
          searchVersionName.toLowerCase(),
        ));

    // 4. Item Type filter
    let matchesItemType = true;
    if (selectedItemType !== "ALL") {
      const itemCodes = new Set<string>();
      hscb.HscbVersions?.forEach((v) => {
        v.HscbItems?.forEach((i) => itemCodes.add(i.ItemCode));
      });

      const hasMatchingItemType = Array.from(itemCodes).some((code) => {
        const itemInfo = items.find((it) => it.ItemCode === code);
        return itemInfo?.ItemType === selectedItemType;
      });

      matchesItemType = hasMatchingItemType;
    }

    // 5. Validity Status filter
    let matchesStatus = true;
    if (selectedStatus !== "ALL" && latestVersion) {
      const statusInfo = getVersionStatus(latestVersion);
      matchesStatus = statusInfo.status === selectedStatus;
    }

    // 6. Approval Status filter
    let matchesApprovalStatus = true;
    if (selectedApprovalStatus !== "ALL" && latestVersion) {
      matchesApprovalStatus = latestVersion.Status === selectedApprovalStatus;
    }

    return (
      matchesHscbCode &&
      matchesSpec &&
      matchesVersionName &&
      matchesItemType &&
      matchesStatus &&
      matchesApprovalStatus
    );
  });

  const handleSaveHscb = (values: any) => {
    if (editMode === "overwrite" && editingHscb) {
      const latestVersion = getLatestVersion(editingHscb);
      const versionId =
        latestVersion?.HscbVersionId || `HSCB-VERSION-${Date.now()}`;

      let fileUrl = latestVersion?.FileURL || "";
      if (values.fileUpload && values.fileUpload.length > 0) {
        const fileObj = values.fileUpload[0].originFileObj;
        if (fileObj) {
          fileUrl = URL.createObjectURL(fileObj);
        } else {
          fileUrl =
            values.fileUpload[0].url || `/files/${values.fileUpload[0].name}`;
        }
      } else {
        fileUrl = "/files/hscb_placeholder.pdf";
      }

      const updatedVersions = (editingHscb.HscbVersions || []).map((v) => {
        if (v.HscbVersionId === versionId) {
          return {
            ...v,
            VersionName: values.VersionName,
            FileURL: fileUrl,
            ValidTo: values.ValidTo
              ? values.ValidTo.format("YYYY-MM-DD")
              : null,
            HscbItems: (values.itemCodes || []).map(
              (code: string, index: number) => ({
                HscbItemId: `HSCB-ITEM-${Date.now()}-${index}`,
                HscbVersionId: versionId,
                ItemCode: code,
              }),
            ),
          };
        }
        return v;
      });

      const updatedHscb: Hscb = {
        ...editingHscb,
        HscbVersions: updatedVersions,
      };

      // Save SHTT codes
      const newShttMappings: any[] = [];
      if (values.primaryBrandCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-1`,
          HscbVersionId: versionId,
          ShttCode: values.primaryBrandCode,
          ShttType: ShttType.PRIMARY_BRAND,
        });
      }
      if (values.secondaryBrandCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-2`,
          HscbVersionId: versionId,
          ShttCode: values.secondaryBrandCode,
          ShttType: ShttType.SECONDARY_BRAND,
        });
      }
      if (values.industrialDesignCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-3`,
          HscbVersionId: versionId,
          ShttCode: values.industrialDesignCode,
          ShttType: ShttType.INDUSTRIAL_DESIGN,
        });
      }
      if (values.additionalShtt && values.additionalShtt.length > 0) {
        values.additionalShtt.forEach((item: any, idx: number) => {
          if (item && item.shttCode) {
            newShttMappings.push({
              HscbShttId: `SHTT-M-${Date.now()}-add-${idx}`,
              HscbVersionId: versionId,
              ShttCode: item.shttCode,
              ShttType: item.shttType || ShttType.SECONDARY_BRAND,
            });
          }
        });
      }

      dispatch(
        setShttMappingsForVersion({ versionId, mappings: newShttMappings }),
      );
      dispatch(updateHscb(updatedHscb));
      message.success("Cập nhật hồ sơ tự công bố thành công!");
      setIsModalVisible(false);
      setEditingHscb(null);
      setEditMode("create");
      form.resetFields();
    } else if (editMode === "append" && editingHscb) {
      const newVersionId = `HSCB-VERSION-${Date.now()}`;

      let fileUrl = "";
      if (values.fileUpload && values.fileUpload.length > 0) {
        const fileObj = values.fileUpload[0].originFileObj;
        if (fileObj) {
          fileUrl = URL.createObjectURL(fileObj);
        } else {
          fileUrl = `/files/${values.fileUpload[0].name}`;
        }
      } else {
        fileUrl = "/files/hscb_placeholder.pdf";
      }

      const validFromStr = values.ValidFrom
        ? values.ValidFrom.format("YYYY-MM-DD")
        : "";

      // Auto-expire older version if active
      const updatedVersions = (editingHscb.HscbVersions || []).map((v) => {
        if (
          v.ValidTo === null ||
          dayjs(v.ValidTo).isAfter(dayjs(validFromStr))
        ) {
          return { ...v, ValidTo: validFromStr };
        }
        return v;
      });

      const newVersion = {
        HscbVersionId: newVersionId,
        HscbId: editingHscb.HscbId,
        VersionName: values.VersionName,
        FileURL: fileUrl,
        ValidFrom: validFromStr,
        ValidTo: values.ValidTo ? values.ValidTo.format("YYYY-MM-DD") : null,
        Status: DocStatus.APPROVED,
        HscbItems: (values.itemCodes || []).map(
          (code: string, index: number) => ({
            HscbItemId: `HSCB-ITEM-${Date.now()}-${index}`,
            HscbVersionId: newVersionId,
            ItemCode: code,
          }),
        ),
      };

      const updatedHscb: Hscb = {
        ...editingHscb,
        HscbVersions: [...updatedVersions, newVersion],
      };

      // Save SHTT codes
      const newShttMappings: any[] = [];
      if (values.primaryBrandCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-1`,
          HscbVersionId: newVersionId,
          ShttCode: values.primaryBrandCode,
          ShttType: ShttType.PRIMARY_BRAND,
        });
      }
      if (values.secondaryBrandCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-2`,
          HscbVersionId: newVersionId,
          ShttCode: values.secondaryBrandCode,
          ShttType: ShttType.SECONDARY_BRAND,
        });
      }
      if (values.industrialDesignCode) {
        newShttMappings.push({
          HscbShttId: `SHTT-M-${Date.now()}-3`,
          HscbVersionId: newVersionId,
          ShttCode: values.industrialDesignCode,
          ShttType: ShttType.INDUSTRIAL_DESIGN,
        });
      }
      if (values.additionalShtt && values.additionalShtt.length > 0) {
        values.additionalShtt.forEach((item: any, idx: number) => {
          if (item && item.shttCode) {
            newShttMappings.push({
              HscbShttId: `SHTT-M-${Date.now()}-add-${idx}`,
              HscbVersionId: newVersionId,
              ShttCode: item.shttCode,
              ShttType: item.shttType || ShttType.SECONDARY_BRAND,
            });
          }
        });
      }

      dispatch(
        setShttMappingsForVersion({
          versionId: newVersionId,
          mappings: newShttMappings,
        }),
      );
      dispatch(updateHscb(updatedHscb));
      message.success("Thêm Phụ lục / Nhãn bổ sung thành công!");
      setIsModalVisible(false);
      setEditingHscb(null);
      setEditMode("create");
      form.resetFields();
    } else {
      const newHscbId = `HSCB-${Date.now()}`;
      const newVersionId = `HSCB-VERSION-${Date.now()}`;

      let fileUrl = "";
      if (values.fileUpload && values.fileUpload.length > 0) {
        const fileObj = values.fileUpload[0].originFileObj;
        if (fileObj) {
          fileUrl = URL.createObjectURL(fileObj);
        } else {
          fileUrl = `/files/${values.fileUpload[0].name}`;
        }
      } else {
        fileUrl = "/files/hscb_placeholder.pdf";
      }

      const newHscb: Hscb = {
        HscbId: newHscbId,
        HscbCode: values.HscbCode,
        SpecId: values.SpecId,
        HscbVersions: [
          {
            HscbVersionId: newVersionId,
            HscbId: newHscbId,
            VersionName: values.VersionName,
            FileURL: fileUrl,
            ValidFrom: values.ValidFrom
              ? values.ValidFrom.format("YYYY-MM-DD")
              : "",
            ValidTo: values.ValidTo
              ? values.ValidTo.format("YYYY-MM-DD")
              : null,
            Status: DocStatus.APPROVED,
            HscbItems: values.itemCodes.map((code: string, index: number) => ({
              HscbItemId: `HSCB-ITEM-${Date.now()}-${index}`,
              HscbVersionId: newVersionId,
              ItemCode: code,
            })),
          },
        ],
      };

      // Save SHTT codes
      if (values.primaryBrandCode) {
        dispatch(
          addShttMapping({
            HscbShttId: `SHTT-M-${Date.now()}-1`,
            HscbVersionId: newVersionId,
            ShttCode: values.primaryBrandCode,
            ShttType: ShttType.PRIMARY_BRAND,
          }),
        );
      }
      if (values.secondaryBrandCode) {
        dispatch(
          addShttMapping({
            HscbShttId: `SHTT-M-${Date.now()}-2`,
            HscbVersionId: newVersionId,
            ShttCode: values.secondaryBrandCode,
            ShttType: ShttType.SECONDARY_BRAND,
          }),
        );
      }
      if (values.industrialDesignCode) {
        dispatch(
          addShttMapping({
            HscbShttId: `SHTT-M-${Date.now()}-3`,
            HscbVersionId: newVersionId,
            ShttCode: values.industrialDesignCode,
            ShttType: ShttType.INDUSTRIAL_DESIGN,
          }),
        );
      }
      if (values.additionalShtt && values.additionalShtt.length > 0) {
        values.additionalShtt.forEach((item: any, idx: number) => {
          if (item && item.shttCode) {
            dispatch(
              addShttMapping({
                HscbShttId: `SHTT-M-${Date.now()}-add-${idx}`,
                HscbVersionId: newVersionId,
                ShttCode: item.shttCode,
                ShttType: item.shttType || ShttType.SECONDARY_BRAND,
              }),
            );
          }
        });
      }

      dispatch(addHscb(newHscb));
      message.success("Thêm hồ sơ tự công bố thành công!");
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  const handleOpenUpdateModal = (record: Hscb) => {
    setEditMode("overwrite");
    setEditingHscb(record);
    const latest = getLatestVersion(record);

    // Find SHTT mappings for latest version
    const versionShtts = latest
      ? shttMappings.filter((m) => m.HscbVersionId === latest.HscbVersionId)
      : [];
    const primaryBrand =
      versionShtts.find((m) => m.ShttType === ShttType.PRIMARY_BRAND)
        ?.ShttCode || "";

    const secondaryBrandMapping = versionShtts.find(
      (m) => m.ShttType === ShttType.SECONDARY_BRAND,
    );
    const secondaryBrand = secondaryBrandMapping?.ShttCode || "";

    const industrialDesignMapping = versionShtts.find(
      (m) => m.ShttType === ShttType.INDUSTRIAL_DESIGN,
    );
    const industrialDesign = industrialDesignMapping?.ShttCode || "";

    const additional = versionShtts
      .filter((m) => {
        if (m.ShttType === ShttType.PRIMARY_BRAND) return false;
        if (
          secondaryBrandMapping &&
          m.HscbShttId === secondaryBrandMapping.HscbShttId
        )
          return false;
        if (
          industrialDesignMapping &&
          m.HscbShttId === industrialDesignMapping.HscbShttId
        )
          return false;
        return true;
      })
      .map((m) => ({ shttType: m.ShttType, shttCode: m.ShttCode }));

    // Prepare fileUpload list
    const fileList = latest?.FileURL
      ? [
          {
            uid: "-1",
            name: latest.FileURL.split("/").pop() || "document.pdf",
            status: "done" as const,
            url: latest.FileURL,
          },
        ]
      : [];

    form.setFieldsValue({
      HscbCode: record.HscbCode,
      SpecId: record.SpecId,
      VersionName: latest?.VersionName || "",
      ValidFrom: latest?.ValidFrom ? dayjs(latest.ValidFrom) : null,
      ValidTo: latest?.ValidTo ? dayjs(latest.ValidTo) : null,
      itemCodes: latest?.HscbItems?.map((it) => it.ItemCode) || [],
      primaryBrandCode: primaryBrand,
      secondaryBrandCode: secondaryBrand,
      industrialDesignCode: industrialDesign,
      additionalShtt: additional,
      fileUpload: fileList,
    });

    setIsModalVisible(true);
  };

  const handleOpenAppendModal = (record: Hscb) => {
    setEditMode("append");
    setEditingHscb(record);
    const latest = getLatestVersion(record);

    // Find SHTT mappings for latest version to inherit
    const versionShtts = latest
      ? shttMappings.filter((m) => m.HscbVersionId === latest.HscbVersionId)
      : [];
    const primaryBrand =
      versionShtts.find((m) => m.ShttType === ShttType.PRIMARY_BRAND)
        ?.ShttCode || "";

    const secondaryBrandMapping = versionShtts.find(
      (m) => m.ShttType === ShttType.SECONDARY_BRAND,
    );
    const secondaryBrand = secondaryBrandMapping?.ShttCode || "";

    const industrialDesignMapping = versionShtts.find(
      (m) => m.ShttType === ShttType.INDUSTRIAL_DESIGN,
    );
    const industrialDesign = industrialDesignMapping?.ShttCode || "";

    const additional = versionShtts
      .filter((m) => {
        if (m.ShttType === ShttType.PRIMARY_BRAND) return false;
        if (
          secondaryBrandMapping &&
          m.HscbShttId === secondaryBrandMapping.HscbShttId
        )
          return false;
        if (
          industrialDesignMapping &&
          m.HscbShttId === industrialDesignMapping.HscbShttId
        )
          return false;
        return true;
      })
      .map((m) => ({ shttType: m.ShttType, shttCode: m.ShttCode }));

    form.setFieldsValue({
      HscbCode: record.HscbCode,
      SpecId: record.SpecId,
      VersionName: "", // Để trống để nhập mới
      ValidFrom: null, // Nhập ngày hiệu lực mới cho phụ lục
      ValidTo: null,
      itemCodes: latest?.HscbItems?.map((it) => it.ItemCode) || [], // Kế thừa danh sách vật tư
      primaryBrandCode: primaryBrand, // Kế thừa SHTT
      secondaryBrandCode: secondaryBrand, // Kế thừa SHTT
      industrialDesignCode: industrialDesign, // Kế thừa SHTT
      additionalShtt: additional, // Kế thừa SHTT
      fileUpload: [], // Để trống để tải lên tài liệu mới
    });

    setIsModalVisible(true);
  };

  const handlePreviewPdf = async (shouldValidate = true) => {
    try {
      const values = shouldValidate
        ? await form.validateFields()
        : form.getFieldsValue();
      const newHscbId = `PREVIEW-HSCB-${Date.now()}`;
      const newVersionId = `PREVIEW-VERSION-${Date.now()}`;

      let fileUrl = "";
      if (values.fileUpload && values.fileUpload.length > 0) {
        const fileObj = values.fileUpload[0].originFileObj;
        if (fileObj) {
          fileUrl = URL.createObjectURL(fileObj);
        } else {
          fileUrl = `/files/${values.fileUpload[0].name}`;
        }
      } else {
        fileUrl = "/files/hscb_placeholder.pdf";
      }

      const mockHscb: Hscb = {
        HscbId: newHscbId,
        HscbCode: values.HscbCode || "CHƯA_NHẬP_MÃ",
        SpecId: values.SpecId,
        HscbVersions: [
          {
            HscbVersionId: newVersionId,
            HscbId: newHscbId,
            VersionName: values.VersionName || "Chưa nhập tên phiên bản",
            FileURL: fileUrl,
            ValidFrom: values.ValidFrom
              ? values.ValidFrom.format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"),
            ValidTo: values.ValidTo
              ? values.ValidTo.format("YYYY-MM-DD")
              : null,
            Status: DocStatus.APPROVED,
            HscbItems: (values.itemCodes || []).map(
              (code: string, index: number) => ({
                HscbItemId: `PREVIEW-ITEM-${Date.now()}-${index}`,
                HscbVersionId: newVersionId,
                ItemCode: code,
              }),
            ),
          },
        ],
      };

      setSelectedHscbForPdf(mockHscb);
      setIsPdfDrawerVisible(true);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      message.error(
        "Vui lòng điền đầy đủ các trường thông tin bắt buộc để xem trước PDF!",
      );
    }
  };

  // Helper to format ItemType label
  const getItemTypeLabel = (type?: string) => {
    switch (type) {
      case "FG":
        return "Thành phẩm (FG)";
      case "IP":
        return "Bán thành phẩm (IP)";
      case "RM":
        return "Nguyên liệu (RM)";
      case "PG":
        return "Bao bì (PG)";
      default:
        return type || "N/A";
    }
  };

  // Main columns
  const columns = [
    {
      title: "Mã Hồ Sơ",
      dataIndex: "HscbCode",
      key: "HscbCode",
      width: 150,
      align: "center" as const,
      render: (text: string) => (
        <strong style={{ color: "#096dd9" }}>{text}</strong>
      ),
    },
    {
      title: "Tiêu chuẩn cơ sở",
      key: "Spec",
      width: 350,
      render: (record: Hscb) => {
        const spec = specs.find((s) => s.SpecId === record.SpecId);
        if (!spec) return <span style={{ color: "#999" }}>Chưa liên kết</span>;
        return (
          <div style={{ overflow: "hidden" }}>
            <div>{spec.SpecCode}</div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "330px",
              }}
              title={spec.SpecName}
            >
              {spec.SpecName}
            </div>
          </div>
        );
      },
    },
    {
      title: "Phiên Bản Hiện Hành",
      key: "LatestVersion",
      width: 350,
      render: (record: Hscb) => {
        const latest = getLatestVersion(record);
        if (!latest) return "-";
        return (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "330px",
              }}
              title={latest.VersionName}
            >
              {latest.VersionName}
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              H/L từ: {formatDate(latest.ValidFrom)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      key: "Status",
      width: 150,
      align: "center" as const,
      render: (record: Hscb) => {
        const latest = getLatestVersion(record);
        if (!latest) return "-";
        const statusInfo = getVersionStatus(latest);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Trạng thái duyệt",
      key: "ApprovalStatus",
      width: 160,
      align: "center" as const,
      render: (record: Hscb) => {
        const latest = getLatestVersion(record);
        if (!latest || !latest.Status) return "-";
        switch (latest.Status) {
          case DocStatus.APPROVED:
            return <Tag color="green">Đã duyệt</Tag>;
          case DocStatus.PENDING:
            return <Tag color="gold">Chờ duyệt</Tag>;
          case DocStatus.REJECTED:
            return <Tag color="red">Từ chối</Tag>;
          default:
            return <Tag>{latest.Status}</Tag>;
        }
      },
    },
    {
      title: "Tài liệu",
      key: "File",
      fixed: "right" as const,
      width: 120,
      align: "center" as const,
      render: (record: Hscb) => {
        const latest = getLatestVersion(record);
        if (!latest || !latest.FileURL) return "-";
        return (
          <Button
            type="link"
            onClick={() => {
              setSelectedHscbForPdf(record);
              setIsPdfDrawerVisible(true);
            }}
            style={{ padding: 0 }}
          >
            <Space>
              <FilePdfOutlined style={{ color: "#ff4d4f" }} />
              PDF
            </Space>
          </Button>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 140,
      render: (record: Hscb) => (
        <Space size="middle">
          <Tooltip title="Chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setSelectedDetailHscb(record);
                setIsDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cập nhật thông tin (Ghi đè)">
            <Button
              icon={
                <EditOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
              }
              onClick={() => handleOpenUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Thêm Phụ lục / Nhãn bổ sung">
            <Button
              icon={
                <FileAddOutlined
                  style={{ fontSize: "16px", color: "#52c41a" }}
                />
              }
              onClick={() => handleOpenAppendModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Lookup spec for details modal
  const detailSpec = selectedDetailHscb
    ? specs.find((s) => s.SpecId === selectedDetailHscb.SpecId)
    : null;

  // Sort versions for details modal
  const detailVersions = selectedDetailHscb?.HscbVersions
    ? [...selectedDetailHscb.HscbVersions].sort(
        (a, b) => dayjs(b.ValidFrom).unix() - dayjs(a.ValidFrom).unix(),
      )
    : [];

  return (
    <div>
      {/* Collapsible Filter Panel */}
      <Collapse
        defaultActiveKey={["filterPanel"]}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
        }}
      >
        <Collapse.Panel
          key="filterPanel"
          header={
            <span
              style={{
                color: PRIMARY_COLOR,
                fontWeight: "bold",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MenuUnfoldOutlined
                style={{ marginRight: 8, fontSize: "14px" }}
              />
              Tìm kiếm và chức năng
            </span>
          }
          style={{ background: "#ffffff", border: "none" }}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Mã Hồ Sơ:
              </div>
              <Input
                placeholder="Nhập mã hồ sơ..."
                value={tempHscbCode}
                onChange={(e) => setTempHscbCode(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Tiêu chuẩn cơ sở:
              </div>
              <Input
                placeholder="Mã hoặc tên TCCS..."
                value={tempSpec}
                onChange={(e) => setTempSpec(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phiên Bản Hiện Hành:
              </div>
              <Input
                placeholder="Tên phiên bản..."
                value={tempVersionName}
                onChange={(e) => setTempVersionName(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Phân loại vật tư:
              </div>
              <Select
                value={tempItemType}
                onChange={(value) => setTempItemType(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả phân loại</Select.Option>
                <Select.Option value="FG">Thành phẩm (FG)</Select.Option>
                <Select.Option value="IP">Bán thành phẩm (IP)</Select.Option>
                <Select.Option value="RM">Nguyên liệu (RM)</Select.Option>
                <Select.Option value="PG">Bao bì (PG)</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Trạng thái hiệu lực:
              </div>
              <Select
                value={tempStatus}
                onChange={(value) => setTempStatus(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                <Select.Option value="ACTIVE">Đang hiệu lực</Select.Option>
                <Select.Option value="EXPIRED">Hết hiệu lực</Select.Option>
                <Select.Option value="PENDING">Chưa hiệu lực</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Trạng thái duyệt:
              </div>
              <Select
                value={tempApprovalStatus}
                onChange={(value) => setTempApprovalStatus(value)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                <Select.Option value="APPROVED">Đã duyệt</Select.Option>
                <Select.Option value="PENDING">Chờ duyệt</Select.Option>
                <Select.Option value="REJECTED">Từ chối</Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={24} lg={12}>
              <Space size="middle" wrap style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                  }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  style={{ background: "#107c41", borderColor: "#107c41" }}
                  onClick={() =>
                    message.info(
                      "Chức năng tải lên Excel đang được phát triển!",
                    )
                  }
                >
                  Upload Excel
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditMode("create");
                    setEditingHscb(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  Thêm hồ sơ công bố
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      <AppTable
        dataSource={filteredHscbs}
        columns={columns}
        rowKey="HscbId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
        scroll={{ x: 1440 }}
      />

      {/* AI Thinking Loading Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: PRIMARY_COLOR,
            }}
          >
            <SyncOutlined
              spin
              style={{ fontSize: "18px", color: PRIMARY_COLOR }}
            />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              AI Thinking: Đang phân rã thông tin
            </span>
          </div>
        }
        open={isAiLoading}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
        width={400}
        zIndex={1100}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Progress
            type="line"
            percent={aiProgress}
            strokeColor={PRIMARY_COLOR}
            status="active"
          />
          <div style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}>
            Hệ thống đang trích xuất dữ liệu từ file PDF bằng AI...
          </div>
        </div>
      </Modal>

      {/* 3. Add Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: PRIMARY_COLOR,
            }}
          >
            {editMode === "overwrite" ? (
              <EditOutlined
                style={{ fontSize: "18px", color: PRIMARY_COLOR }}
              />
            ) : editMode === "append" ? (
              <PlusOutlined
                style={{ fontSize: "18px", color: PRIMARY_COLOR }}
              />
            ) : (
              <FileAddOutlined
                style={{ fontSize: "18px", color: PRIMARY_COLOR }}
              />
            )}
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              {editMode === "overwrite"
                ? "Cập Nhật Hồ Sơ Tự Công Bố (Ghi đè)"
                : editMode === "append"
                  ? "Thêm Phụ Lục / Nhãn Bổ Sung"
                  : "Thêm Hồ Sơ Tự Công Bố Mới"}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingHscb(null);
          setEditMode("create");
          form.resetFields();
        }}
        width={750}
        footer={[
          <div
            key="footer-container"
            style={{
              borderTop: "1px solid #f0f0f0",
              paddingTop: "16px",
              marginTop: "8px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button
              key="cancel"
              onClick={() => {
                setIsModalVisible(false);
                setEditingHscb(null);
                setEditMode("create");
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button key="submit" type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>
          </div>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveHscb}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="HscbCode"
                label="Mã Hồ Sơ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Mã hồ sơ công bố!",
                  },
                ]}
              >
                <Input
                  placeholder="Ví dụ: HSCB-FG001-V2"
                  disabled={editMode !== "create"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="SpecId"
                label="Tiêu chuẩn đính kèm (Spec)"
                rules={[
                  { required: true, message: "Vui lòng chọn tiêu chuẩn!" },
                ]}
              >
                {/* Quy tắc: Chỉ được liên kết với tiêu chuẩn cơ sở pháp lý (TCCS),
                    tiêu chuẩn nội bộ có mã QL-One không được gán cho HSCB. */}
                <Select
                  placeholder="Chọn tiêu chuẩn..."
                  showSearch
                  disabled={editMode !== "create"}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={specs
                    .filter((s) => s.SpecType === "TCCS" && !s.QloneCode)
                    .map((s) => ({
                      value: s.SpecId,
                      label: `${s.SpecCode} - ${s.SpecName}`,
                    }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="VersionName"
                label="Tên Phiên Bản (VersionName)"
                rules={[
                  { required: true, message: "Vui lòng nhập Tên phiên bản!" },
                ]}
              >
                <Input placeholder="Ví dụ: Bản nâng cấp nhãn tương v2" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="fileUpload"
            label="Tài liệu đính kèm (PDF)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            style={{
              marginBottom:
                fileUploadList && fileUploadList.length > 0 ? "8px" : "24px",
            }}
          >
            <Upload.Dragger
              name="files"
              accept=".pdf"
              beforeUpload={(file) => {
                handleAiParsing(file);
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo thả file PDF hoặc nhấp để tải lên
              </p>
            </Upload.Dragger>
          </Form.Item>

          {fileUploadList &&
            fileUploadList.length > 0 &&
            (() => {
              const file = fileUploadList[0];
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fafafa",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "24px",
                    minHeight: "64px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        background: "#ffffff",
                        borderRadius: "6px",
                        border: "1px solid #d9d9d9",
                        flexShrink: 0,
                      }}
                    >
                      <FilePdfOutlined
                        style={{ color: "#ff4d4f", fontSize: "20px" }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          color: "#262626",
                          fontSize: "14px",
                          lineHeight: "1.4",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#8c8c8c",
                          marginTop: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: "#52c41a",
                          }}
                        />
                        Trích xuất dữ liệu bằng AI thành công
                      </span>
                    </div>
                  </div>
                  <Space size="middle">
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreviewPdf(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        color: PRIMARY_COLOR,
                        borderColor: PRIMARY_COLOR,
                        fontWeight: 500,
                        fontSize: "13px",
                        borderRadius: "6px",
                      }}
                    >
                      Xem file
                    </Button>
                    <Button
                      type="default"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => {
                        form.setFieldsValue({ fileUpload: [] });
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontWeight: 500,
                        fontSize: "13px",
                        borderRadius: "6px",
                      }}
                    >
                      Xóa file
                    </Button>
                  </Space>
                </div>
              );
            })()}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ValidFrom"
                label="Có hiệu lực từ"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hiệu lực!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabled={editMode === "overwrite"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ValidTo" label="Hết hiệu lực vào">
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="itemCodes"
            label="Vật tư áp dụng (Chọn nhiều ItemCode)"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một vật tư!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các ItemCode..."
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={items.map((item) => ({
                value: item.ItemCode,
                label: `${item.ItemCode} - ${item.ItemName} (${item.ItemType})`,
              }))}
            />
          </Form.Item>

          <Divider
            orientation={"left" as any}
            style={{ margin: "24px 0 16px 0" }}
          >
            Thông tin Số đơn Sở hữu trí tuệ liên kết (SHTT)
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="primaryBrandCode"
                label="Số đơn chính (Nhãn chính)"
              >
                <Input placeholder="Số đơn nhãn chính..." allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="secondaryBrandCode"
                label="Số đơn phụ (Nhãn phụ)"
              >
                <Input placeholder="Số đơn nhãn phụ..." allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="industrialDesignCode"
                label="Số đơn Kiểu dáng CN"
              >
                <Input placeholder="Số đơn kiểu dáng..." allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="additionalShtt">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#595959" }}>
                    Số đơn bổ sung (Nhãn phụ / Kiểu dáng CN)
                  </span>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({ shttType: "SECONDARY_BRAND", shttCode: "" })
                    }
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Thêm số đơn
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    key={key}
                    gutter={16}
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "shttType"]}
                        rules={[
                          { required: true, message: "Chọn loại số đơn!" },
                        ]}
                        noStyle
                      >
                        <Select style={{ width: "100%" }}>
                          <Select.Option value="SECONDARY_BRAND">
                            Nhãn phụ
                          </Select.Option>
                          <Select.Option value="INDUSTRIAL_DESIGN">
                            Kiểu dáng công nghiệp
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "shttCode"]}
                        rules={[{ required: true, message: "Nhập số đơn!" }]}
                        noStyle
                      >
                        <Input placeholder="Số đơn SHTT..." allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      />
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* 4. Details Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: PRIMARY_COLOR,
            }}
          >
            <EyeOutlined style={{ fontSize: "18px", color: PRIMARY_COLOR }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Chi tiết Hồ sơ Tự Công Bố Sản phẩm
            </span>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedDetailHscb(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedDetailHscb(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedDetailHscb && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Hồ Sơ" span={2}>
                <strong>{selectedDetailHscb.HscbCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="ID Hệ thống">
                {selectedDetailHscb.HscbId}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng phiên bản">
                {selectedDetailHscb.HscbVersions?.length || 0} phiên bản
              </Descriptions.Item>
              <Descriptions.Item
                label="Tiêu chuẩn áp dụng (TCCS/SPEC)"
                span={2}
              >
                {detailSpec ? (
                  <div>
                    <strong>{detailSpec.SpecCode}</strong> -{" "}
                    {detailSpec.SpecName}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginTop: "4px",
                      }}
                    >
                      Loại:{" "}
                      {detailSpec.SpecType === "TCCS"
                        ? "Tiêu chuẩn cơ sở (TCCS)"
                        : "Tiêu chuẩn kỹ thuật (SPEC)"}
                      {detailSpec.QloneCode &&
                        ` | Mã QL-One: ${detailSpec.QloneCode}`}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: "#999" }}>
                    Chưa liên kết tiêu chuẩn
                  </span>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider
              orientation={"left" as any}
              style={{ margin: "20px 0 10px 0" }}
            >
              Thông tin các Phiên bản & Vật tư áp dụng
            </Divider>

            {detailVersions.length === 0 ? (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#999" }}
              >
                Chưa có thông tin phiên bản.
              </div>
            ) : (
              <Collapse
                defaultActiveKey={[detailVersions[0]?.HscbVersionId]}
                accordion
                style={{ background: "#ffffff", border: "none" }}
              >
                {detailVersions.map((version) => {
                  const statusInfo = getVersionStatus(version);
                  const versionShtts = shttMappings.filter(
                    (m) => m.HscbVersionId === version.HscbVersionId,
                  );
                  return (
                    <Collapse.Panel
                      key={version.HscbVersionId}
                      header={
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>
                          {version.VersionName}
                        </span>
                      }
                      style={{
                        marginBottom: "12px",
                        background: "#fbfbfb",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                        overflow: "hidden",
                      }}
                    >
                      {/* General Info Section */}
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",
                          marginBottom: "8px",
                          color: "#262626",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "4px",
                            height: "12px",
                            background: PRIMARY_COLOR,
                            marginRight: "6px",
                            display: "inline-block",
                            borderRadius: "2px",
                          }}
                        ></span>
                        Thông tin chung:
                      </div>

                      <Descriptions
                        size="small"
                        bordered
                        column={2}
                        style={{ marginBottom: "16px", background: "#ffffff" }}
                      >
                        <Descriptions.Item label="Mã Phiên bản">
                          <strong>{version.HscbVersionId}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái hiệu lực">
                          <Tag color={statusInfo.color} style={{ margin: 0 }}>
                            {statusInfo.text}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái duyệt">
                          {(() => {
                            switch (version.Status) {
                              case DocStatus.APPROVED:
                                return (
                                  <Tag color="success" style={{ margin: 0 }}>
                                    Đã duyệt
                                  </Tag>
                                );
                              case DocStatus.REJECTED:
                                return (
                                  <Tag color="error" style={{ margin: 0 }}>
                                    Từ chối
                                  </Tag>
                                );
                              default:
                                return (
                                  <Tag color="warning" style={{ margin: 0 }}>
                                    Chờ duyệt
                                  </Tag>
                                );
                            }
                          })()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tài liệu PDF">
                          {version.FileURL ? (
                            <Button
                              type="link"
                              onClick={() => {
                                if (selectedDetailHscb) {
                                  setSelectedHscbForPdf(selectedDetailHscb);
                                  setIsPdfDrawerVisible(true);
                                }
                              }}
                              style={{ padding: 0, height: "auto" }}
                              icon={
                                <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                              }
                            >
                              Xem tài liệu công bố (
                              {version.FileURL.split("/").pop()})
                            </Button>
                          ) : (
                            "-"
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày bắt đầu hiệu lực">
                          {formatDate(version.ValidFrom)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày hết hiệu lực">
                          {version.ValidTo ? (
                            formatDate(version.ValidTo)
                          ) : (
                            <span style={{ color: "green", fontWeight: 500 }}>
                              Đang hiệu lực/Vô thời hạn
                            </span>
                          )}
                        </Descriptions.Item>
                      </Descriptions>

                      {/* SHTT list */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            marginBottom: "8px",
                            color: "#262626",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "4px",
                              height: "12px",
                              background: PRIMARY_COLOR,
                              marginRight: "6px",
                              display: "inline-block",
                              borderRadius: "2px",
                            }}
                          ></span>
                          Số đơn Sở hữu trí tuệ (SHTT) liên kết:
                        </div>
                        {versionShtts && versionShtts.length > 0 ? (
                          <Table
                            size="small"
                            dataSource={versionShtts}
                            rowKey="HscbShttId"
                            pagination={false}
                            bordered
                            columns={[
                              {
                                title: "Phân loại",
                                dataIndex: "ShttType",
                                key: "ShttType",
                                width: 140,
                                render: (type) => {
                                  const shttConfig =
                                    ShttTypeConfig[type as ShttType];
                                  return (
                                    <Tag
                                      color={
                                        shttConfig
                                          ? shttConfig.color
                                          : "default"
                                      }
                                    >
                                      {shttConfig ? shttConfig.label : type}
                                    </Tag>
                                  );
                                },
                              },
                              {
                                title: "Số đơn SHTT",
                                dataIndex: "ShttCode",
                                key: "ShttCode",
                                width: 120,
                                render: (code) => <strong>{code}</strong>,
                              },
                              {
                                title: "Tên nhãn hiệu",
                                key: "Trademark_Name",
                                render: (_, record) => {
                                  const registry = ipmsInfo[record.ShttCode];
                                  return registry
                                    ? registry.Trademark_Name
                                    : "-";
                                },
                              },
                              {
                                title: "Chủ sở hữu",
                                key: "Owner",
                                render: (_, record) => {
                                  const registry = ipmsInfo[record.ShttCode];
                                  return registry ? (
                                    registry.Owner
                                  ) : (
                                    <span
                                      style={{
                                        color: "#bfbfbf",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      (Không tìm thấy đăng ký IPMS)
                                    </span>
                                  );
                                },
                              },
                              {
                                title: "Trạng thái IPMS",
                                key: "Status",
                                width: 130,
                                align: "center" as const,
                                render: (_, record) => {
                                  const registry = ipmsInfo[record.ShttCode];
                                  if (!registry) return "-";
                                  const config =
                                    IpmsStatusConfig[
                                      registry.Status as IpmsStatus
                                    ];
                                  return (
                                    <Tag color={config?.color || "default"}>
                                      {config?.label || registry.Status}
                                    </Tag>
                                  );
                                },
                              },
                            ]}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "8px",
                              background: "#fafafa",
                              border: "1px solid #f0f0f0",
                              borderRadius: "4px",
                              color: "#999",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Không có đơn SHTT liên kết
                          </div>
                        )}
                      </div>

                      {/* Items list */}
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            marginBottom: "8px",
                            color: "#262626",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "4px",
                              height: "12px",
                              background: "#52c41a",
                              marginRight: "6px",
                              display: "inline-block",
                              borderRadius: "2px",
                            }}
                          ></span>
                          Danh sách vật tư áp dụng:
                        </div>
                        {version.HscbItems && version.HscbItems.length > 0 ? (
                          <Table
                            size="small"
                            dataSource={version.HscbItems}
                            rowKey="HscbItemId"
                            pagination={false}
                            bordered
                            columns={[
                              {
                                title: "Mã vật tư",
                                dataIndex: "ItemCode",
                                key: "ItemCode",
                                width: 120,
                                render: (code) => (
                                  <strong style={{ color: "#096dd9" }}>
                                    {code}
                                  </strong>
                                ),
                              },
                              {
                                title: "Tên vật tư",
                                key: "ItemName",
                                render: (_, record) => {
                                  const itemDetail = items.find(
                                    (it) => it.ItemCode === record.ItemCode,
                                  );
                                  return (
                                    itemDetail?.ItemName || "Chưa có tên vật tư"
                                  );
                                },
                              },
                              {
                                title: "Phân loại",
                                key: "ItemType",
                                width: 160,
                                render: (_, record) => {
                                  const itemDetail = items.find(
                                    (it) => it.ItemCode === record.ItemCode,
                                  );
                                  if (!itemDetail?.ItemType) return "-";
                                  switch (itemDetail.ItemType) {
                                    case "FG":
                                      return (
                                        <Tag color="blue">Thành phẩm (FG)</Tag>
                                      );
                                    case "IP":
                                      return (
                                        <Tag color="purple">
                                          Bán thành phẩm (IP)
                                        </Tag>
                                      );
                                    case "RM":
                                      return (
                                        <Tag color="green">
                                          Nguyên liệu (RM)
                                        </Tag>
                                      );
                                    case "PG":
                                      return (
                                        <Tag color="orange">Bao bì (PG)</Tag>
                                      );
                                    default:
                                      return <Tag>{itemDetail.ItemType}</Tag>;
                                  }
                                },
                              },
                              {
                                title: "ĐVT",
                                key: "UoM",
                                width: 100,
                                align: "center" as const,
                                render: (_, record) => {
                                  const itemDetail = items.find(
                                    (it) => it.ItemCode === record.ItemCode,
                                  );
                                  return itemDetail?.UoM || "-";
                                },
                              },
                            ]}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "8px",
                              background: "#fafafa",
                              border: "1px solid #f0f0f0",
                              borderRadius: "4px",
                              color: "#999",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Không có vật tư nào được gán
                          </div>
                        )}
                      </div>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            )}
          </div>
        )}
      </Modal>

      {/* 5. PDF Viewer Drawer */}
      <Drawer
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <FilePdfOutlined
              style={{ color: "#ff4d4f", marginRight: 8, fontSize: "20px" }}
            />
            Xem Tài Liệu Công Bố -{" "}
            <strong style={{ color: "#096dd9", marginLeft: 4 }}>
              {selectedHscbForPdf?.HscbCode}
            </strong>
          </span>
        }
        placement="right"
        width={750}
        onClose={() => {
          setIsPdfDrawerVisible(false);
          setSelectedHscbForPdf(null);
        }}
        open={isPdfDrawerVisible}
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#f0f2f5",
          },
        }}
      >
        {selectedHscbForPdf &&
          (() => {
            const latestVersion = getLatestVersion(selectedHscbForPdf);
            const spec = specs.find(
              (s) => s.SpecId === selectedHscbForPdf.SpecId,
            );
            const statusInfo = latestVersion
              ? getVersionStatus(latestVersion)
              : { text: "Không xác định", color: "gray" };
            const validFromDate = latestVersion
              ? dayjs(latestVersion.ValidFrom)
              : dayjs();
            const day = validFromDate.format("DD");
            const month = validFromDate.format("MM");
            const year = validFromDate.format("YYYY");
            const paperWidth = 650 * (pdfZoom / 100);

            return (
              <>
                {/* PDF Toolbar */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: "10px 24px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#262626",
                    }}
                  >
                    {selectedHscbForPdf.HscbCode}.pdf
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.max(50, prev - 10))
                      }
                      disabled={pdfZoom <= 50}
                      size="small"
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        minWidth: "45px",
                        textAlign: "center",
                      }}
                    >
                      {pdfZoom}%
                    </span>
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={() =>
                        setPdfZoom((prev) => Math.min(150, prev + 10))
                      }
                      disabled={pdfZoom >= 150}
                      size="small"
                    />
                  </div>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadFakePdf}
                      type="primary"
                      ghost
                      size="small"
                    >
                      Tải xuống
                    </Button>
                    <Button
                      icon={<PrinterOutlined />}
                      onClick={handlePrintFakePdf}
                      size="small"
                    >
                      In
                    </Button>
                  </Space>
                </div>

                {/* PDF Canvas View Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "40px 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    background: "#525659", // Realistic PDF viewer dark background
                  }}
                >
                  {/* A4 Page Container */}
                  <div
                    style={{
                      width: `${paperWidth}px`,
                      minHeight: `${paperWidth * 1.414}px`, // A4 Proportions
                      padding: `${48 * (pdfZoom / 100)}px ${40 * (pdfZoom / 100)}px`,
                      background: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      transition: "all 0.1s ease",
                      fontFamily: "Times New Roman, serif",
                      position: "relative",
                      color: "#111111",
                      fontSize: `${13 * (pdfZoom / 100)}px`,
                      lineHeight: 1.5,
                    }}
                  >
                    {/* Subtle watermarks */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-35deg)",
                        fontSize: `${45 * (pdfZoom / 100)}px`,
                        color: "rgba(0, 0, 0, 0.035)",
                        fontWeight: "bold",
                        letterSpacing: "5px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        zIndex: 1,
                        userSelect: "none",
                      }}
                    >
                      MASAN CONSUMER
                    </div>

                    {/* Header Grid */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: `${24 * (pdfZoom / 100)}px`,
                        borderBottom: `${1 * (pdfZoom / 100)}px solid #ddd`,
                        paddingBottom: `${12 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div style={{ textAlign: "center", width: "45%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CÔNG TY CỔ PHẦN HÀNG TIÊU DÙNG MASAN
                        </div>
                        <div
                          style={{
                            fontSize: `${9 * (pdfZoom / 100)}px`,
                            color: "#555",
                          }}
                        >
                          Số công bố: {selectedHscbForPdf.HscbCode}
                        </div>
                        <div
                          style={{
                            width: `${60 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                      <div style={{ textAlign: "center", width: "50%" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                          }}
                        >
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Độc lập - Tự do - Hạnh phúc
                        </div>
                        <div
                          style={{
                            width: `${80 * (pdfZoom / 100)}px`,
                            height: "1px",
                            background: "#333",
                            margin: "4px auto 0 auto",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: `${30 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: `${18 * (pdfZoom / 100)}px`,
                          fontFamily: "Times New Roman, serif",
                          color: "#000",
                        }}
                      >
                        BẢN TỰ CÔNG BỐ SẢN PHẨM
                      </h2>
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: `${12 * (pdfZoom / 100)}px`,
                          marginTop: `${4 * (pdfZoom / 100)}px`,
                        }}
                      >
                        Số: {selectedHscbForPdf.HscbCode} / MSN-HSCB
                      </div>
                    </div>

                    {/* Section I */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        I. Thông tin về tổ chức, cá nhân tự công bố sản phẩm
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          - Tên tổ chức, cá nhân:{" "}
                          <strong style={{ textTransform: "uppercase" }}>
                            Công ty Cổ phần Hàng tiêu dùng Masan
                          </strong>
                        </div>
                        <div>
                          - Địa chỉ: Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn,
                          Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt
                          Nam.
                        </div>
                        <div>
                          - Điện thoại: 028 6256 3862 &nbsp;&nbsp;|&nbsp;&nbsp;
                          Fax: 028 6256 3863
                        </div>
                        <div>- Email: info@masanconsumer.com</div>
                        <div>
                          - Mã số doanh nghiệp: 0305001234 do Sở Kế hoạch và Đầu
                          tư TP. Hồ Chí Minh cấp đăng ký lần đầu ngày
                          31/05/2007.
                        </div>
                      </div>
                    </div>

                    {/* Section II */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        II. Thông tin về sản phẩm
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div>
                          - Tên sản phẩm:{" "}
                          <strong>
                            {spec ? spec.SpecName : "Chưa liên kết"}
                          </strong>
                        </div>
                        <div>
                          - Tiêu chuẩn cơ sở áp dụng:{" "}
                          <strong>{spec ? spec.SpecCode : "N/A"}</strong>
                        </div>
                        <div>
                          - Phiên bản hồ sơ:{" "}
                          <strong>
                            {latestVersion ? latestVersion.VersionName : "N/A"}
                          </strong>
                        </div>
                        <div>
                          - Trạng thái hiệu lực:{" "}
                          <span
                            style={{
                              color:
                                statusInfo.color === "green"
                                  ? "#52c41a"
                                  : statusInfo.color === "red"
                                    ? "#ff4d4f"
                                    : "#1890ff",
                              fontWeight: "bold",
                            }}
                          >
                            {statusInfo.text}
                          </span>{" "}
                          (Từ{" "}
                          {latestVersion
                            ? formatDate(latestVersion.ValidFrom)
                            : ""}{" "}
                          {latestVersion?.ValidTo
                            ? `đến ${formatDate(latestVersion.ValidTo)}`
                            : "vô thời hạn"}
                          )
                        </div>

                        <div style={{ marginTop: `${10 * (pdfZoom / 100)}px` }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              marginBottom: `${4 * (pdfZoom / 100)}px`,
                            }}
                          >
                            - Danh sách mã vật tư / sản phẩm liên kết áp dụng hồ
                            sơ tự công bố này:
                          </div>

                          {/* Table inside PDF */}
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginTop: `${6 * (pdfZoom / 100)}px`,
                              fontSize: `${11 * (pdfZoom / 100)}px`,
                            }}
                          >
                            <thead>
                              <tr style={{ background: "#f5f5f5" }}>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "center",
                                    width: "8%",
                                  }}
                                >
                                  STT
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "25%",
                                  }}
                                >
                                  Mã vật tư
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "42%",
                                  }}
                                >
                                  Tên vật tư
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "left",
                                    width: "15%",
                                  }}
                                >
                                  Phân loại
                                </th>
                                <th
                                  style={{
                                    border: `${1 * (pdfZoom / 100)}px solid #000`,
                                    padding: `${4 * (pdfZoom / 100)}px`,
                                    textAlign: "center",
                                    width: "10%",
                                  }}
                                >
                                  ĐVT
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {latestVersion?.HscbItems &&
                              latestVersion.HscbItems.length > 0 ? (
                                latestVersion.HscbItems.map(
                                  (hscbItem, index) => {
                                    const itemDetail = items.find(
                                      (it) => it.ItemCode === hscbItem.ItemCode,
                                    );
                                    return (
                                      <tr key={hscbItem.HscbItemId}>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                            textAlign: "center",
                                          }}
                                        >
                                          {index + 1}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          <strong style={{ color: "#096dd9" }}>
                                            {hscbItem.ItemCode}
                                          </strong>
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          {itemDetail?.ItemName || "N/A"}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                          }}
                                        >
                                          {getItemTypeLabel(
                                            itemDetail?.ItemType,
                                          )}
                                        </td>
                                        <td
                                          style={{
                                            border: `${1 * (pdfZoom / 100)}px solid #000`,
                                            padding: `${4 * (pdfZoom / 100)}px`,
                                            textAlign: "center",
                                          }}
                                        >
                                          {itemDetail?.UoM || "N/A"}
                                        </td>
                                      </tr>
                                    );
                                  },
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan={5}
                                    style={{
                                      border: `${1 * (pdfZoom / 100)}px solid #000`,
                                      padding: `${8 * (pdfZoom / 100)}px`,
                                      textAlign: "center",
                                      color: "#888",
                                    }}
                                  >
                                    Không có vật tư áp dụng
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Section III */}
                    <div
                      style={{
                        marginBottom: `${16 * (pdfZoom / 100)}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${14 * (pdfZoom / 100)}px`,
                          textTransform: "uppercase",
                          marginBottom: `${6 * (pdfZoom / 100)}px`,
                        }}
                      >
                        III. Ngoại quan & Bản cam kết chất lượng
                      </div>
                      <div style={{ paddingLeft: `${12 * (pdfZoom / 100)}px` }}>
                        <div
                          style={{
                            fontStyle: "italic",
                            marginBottom: `${4 * (pdfZoom / 100)}px`,
                          }}
                        >
                          Chúng tôi cam kết sản phẩm được sản xuất và đóng gói
                          đúng theo Tiêu chuẩn cơ sở áp dụng số{" "}
                          <strong>{spec ? spec.SpecCode : "N/A"}</strong>, tuân
                          thủ các quy định về giới hạn chỉ tiêu an toàn và vệ
                          sinh thực phẩm hiện hành của Bộ Y tế Việt Nam.
                        </div>
                        <div>
                          Chúng tôi xin hoàn toàn chịu trách nhiệm trước pháp
                          luật về tính chính xác, trung thực của hồ sơ tự công
                          bố này và cam kết đảm bảo sản phẩm lưu thông trên thị
                          trường đạt chất lượng ổn định.
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div
                      style={{
                        marginTop: `${30 * (pdfZoom / 100)}px`,
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 2,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontStyle: "italic",
                            fontSize: `${12 * (pdfZoom / 100)}px`,
                            marginBottom: `${4 * (pdfZoom / 100)}px`,
                          }}
                        >
                          TP. Hồ Chí Minh, ngày {day} tháng {month} năm {year}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${13 * (pdfZoom / 100)}px`,
                            textTransform: "uppercase",
                          }}
                        >
                          ĐẠI DIỆN TỔ CHỨC, CÁ NHÂN
                        </div>
                        <div
                          style={{
                            fontSize: `${11 * (pdfZoom / 100)}px`,
                            fontStyle: "italic",
                            color: "#555",
                            marginBottom: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          (Ký tên và đóng dấu đỏ)
                        </div>

                        {/* Double border red stamp */}
                        <div
                          style={{
                            position: "relative",
                            width: `${110 * (pdfZoom / 100)}px`,
                            height: `${110 * (pdfZoom / 100)}px`,
                            border: `${2.5 * (pdfZoom / 100)}px solid #e02424`,
                            borderRadius: "50%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#e02424",
                            fontSize: `${7 * (pdfZoom / 100)}px`,
                            fontWeight: "bold",
                            textAlign: "center",
                            lineHeight: 1.2,
                            textTransform: "uppercase",
                            opacity: 0.85,
                            transform: "rotate(-3deg)",
                            marginTop: `${10 * (pdfZoom / 100)}px`,
                          }}
                        >
                          <div
                            style={{
                              border: `${1 * (pdfZoom / 100)}px solid #e02424`,
                              borderRadius: "50%",
                              width: "92%",
                              height: "92%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                top: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              CÔNG TY CỔ PHẦN
                            </div>
                            <div
                              style={{
                                fontSize: `${8 * (pdfZoom / 100)}px`,
                                fontWeight: "900",
                                margin: `${2 * (pdfZoom / 100)}px 0`,
                              }}
                            >
                              MASAN CONSUMER
                            </div>
                            <div
                              style={{
                                fontSize: `${6 * (pdfZoom / 100)}px`,
                                position: "absolute",
                                bottom: `${8 * (pdfZoom / 100)}px`,
                                width: "80%",
                              }}
                            >
                              TP. HỒ CHÍ MINH
                            </div>
                          </div>
                          {/* Blue Signature Overlapping */}
                          <div
                            style={{
                              position: "absolute",
                              top: `${25 * (pdfZoom / 100)}px`,
                              left: `${-10 * (pdfZoom / 100)}px`,
                              color: "#1e40af",
                              fontFamily:
                                "'Brush Script MT', 'Dancing Script', cursive",
                              fontSize: `${24 * (pdfZoom / 100)}px`,
                              transform: "rotate(-12deg)",
                              fontWeight: "normal",
                              textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
                            }}
                          >
                            Quang
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
      </Drawer>
    </div>
  );
};

export default HscbList;
