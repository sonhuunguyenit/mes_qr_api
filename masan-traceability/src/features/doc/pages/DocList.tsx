import React, { useState } from "react";
import {
  Input,
  Select,
  Space,
  Button,
  Modal,
  Form,
  DatePicker,
  Row,
  Col,
  message,
  Upload,
  Tag,
  Descriptions,
  Divider,
  Tooltip,
  Drawer,
  Alert,
  Collapse,
  Table,
  Progress,
} from "antd";
import { AppTable } from "../../../components";
import {
  PlusOutlined,
  InboxOutlined,
  FilePdfOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FileExcelOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
  MinusCircleOutlined,
  ReloadOutlined,
  MailOutlined,
  HistoryOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { addDoc, approveDoc, rejectDoc } from "../store/docSlice";
import { Doc, DocType, DocStatus } from "../types";
import { PartnerType } from "../../partner/types";
import {
  allergenTemplateData,
  nutritionTemplateData,
} from "../../../local-data/allergen-nutrition";
import { PRIMARY_COLOR } from "../../../contants";
import dayjs from "dayjs";

export const DocList: React.FC = () => {
  const docs = useAppSelector((state) => state.doc.docs);
  const partners = useAppSelector((state) => state.partner.partners);
  const items = useAppSelector((state) => state.item.items);
  const partnerMappings = useAppSelector((state) => state.partner.mappings);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // Watch form fields
  const selectedPartnerId = Form.useWatch("PartnerId", form);
  const formDocTypes = Form.useWatch("DocTypes", form) || [];
  const fileUploadList = Form.useWatch("fileUpload", form) || [];

  // Drawer preview states for uploaded supplier files
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [previewDocType, setPreviewDocType] = useState<DocType | null>(null);

  // PDF Drawer preview states
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedPdfTitle, setSelectedPdfTitle] = useState("");



  // Automatically pre-select the template code based on selected types
  React.useEffect(() => {
    if (!formDocTypes || formDocTypes.length === 0) {
      form.setFieldsValue({ templateCode: undefined });
      return;
    }
    const hasDiUng = formDocTypes.includes(DocType.DI_UNG);
    const hasDinhDuong = formDocTypes.includes(DocType.DINH_DUONG);

    if (hasDiUng && !hasDinhDuong) {
      form.setFieldsValue({ templateCode: "TEMPLATE_DI_UNG" });
    } else if (hasDinhDuong && !hasDiUng) {
      form.setFieldsValue({ templateCode: "TEMPLATE_DINH_DUONG" });
    } else if (hasDiUng && hasDinhDuong) {
      form.setFieldsValue({ templateCode: "TEMPLATE_DI_UNG" });
    } else {
      form.setFieldsValue({ templateCode: undefined });
    }
  }, [formDocTypes, form]);

  // Table columns for allergen template preview in Drawer
  const allergenColumns = [
    {
      title: "Chỉ tiêu dị ứng",
      dataIndex: "allergenName",
      key: "allergenName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Giá trị (Bằng chứng)",
      dataIndex: "value",
      key: "value",
      render: (val: string) =>
        val ? (
          <Tag color="error">{val}</Tag>
        ) : (
          <span style={{ color: "#d9d9d9" }}>-</span>
        ),
    },
    {
      title: "Tọa độ ô Excel",
      dataIndex: "cell",
      key: "cell",
      render: (cell: string) =>
        cell ? (
          <Tag color="blue">{cell}</Tag>
        ) : (
          <span style={{ color: "#d9d9d9" }}>Chung</span>
        ),
    },
  ];

  // Table columns for nutrition template preview in Drawer
  const nutritionColumns = [
    {
      title: "Chỉ tiêu dinh dưỡng",
      dataIndex: "index",
      key: "index",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      render: (unit: string) => <Tag color="default">{unit}</Tag>,
    },
    {
      title: "Giá trị định lượng",
      dataIndex: "value",
      key: "value",
      render: (val: string) => (
        <strong style={{ color: "#096dd9" }}>{val}</strong>
      ),
    },
    {
      title: "Tọa độ ô Excel",
      dataIndex: "cell",
      key: "cell",
      render: (cell: string) => <Tag color="blue">{cell}</Tag>,
    },
  ];

  // Temp filter states
  const [tempSearchText, setTempSearchText] = useState("");
  const [tempDocType, setTempDocType] = useState<string>("ALL");
  const [tempPartner, setTempPartner] = useState<string>("ALL");
  const [tempStatus, setTempStatus] = useState<string>("ALL");
  const [tempValidity, setTempValidity] = useState<string>("ALL");

  // Active filter states
  const [searchText, setSearchText] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string>("ALL");
  const [selectedPartner, setSelectedPartner] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedValidity, setSelectedValidity] = useState<string>("ALL");

  const handleSearch = () => {
    setSearchText(tempSearchText);
    setSelectedDocType(tempDocType);
    setSelectedPartner(tempPartner);
    setSelectedStatus(tempStatus);
    setSelectedValidity(tempValidity);
  };

  const handleReset = () => {
    setTempSearchText("");
    setTempDocType("ALL");
    setTempPartner("ALL");
    setTempStatus("ALL");
    setTempValidity("ALL");
    setSearchText("");
    setSelectedDocType("ALL");
    setSelectedPartner("ALL");
    setSelectedStatus("ALL");
    setSelectedValidity("ALL");
    message.success("Đã thiết lập lại bộ lọc!");
  };

  // Modals state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDetailDoc, setSelectedDetailDoc] = useState<Doc | null>(null);
  const [selectedHistoryDoc, setSelectedHistoryDoc] = useState<Doc | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [selectedMailDoc, setSelectedMailDoc] = useState<Doc | null>(null);
  const [mailForm] = Form.useForm();
  const [isSendingMail, setIsSendingMail] = useState(false);

  // Request Addition Mail Modal state hooks
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [requestForm] = Form.useForm();
  const [isSendingRequestMail, setIsSendingRequestMail] = useState(false);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  const fillFakeInfo = (file: any) => {
    const docNameWithoutExt =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

    // Pick a random partner if not set
    let partnerId = form.getFieldValue("PartnerId");
    if (!partnerId && partners.length > 0) {
      partnerId = partners[Math.floor(Math.random() * partners.length)].PartnerId;
    }

    // Get items mapped to this partner
    const mappedItemCodes = partnerMappings
      .filter((m) => m.PartnerId === partnerId)
      .map((m) => m.ItemCode);
    const availableItems = items.filter(
      (item) =>
        mappedItemCodes.includes(item.ItemCode) &&
        (item.ItemType === "RM" || item.ItemType === "PG")
    );

    // Pick 1-2 random items
    const randomItems = [...availableItems]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);
    const selectedItemCodes = randomItems.map((item) => item.ItemCode);

    // Pick a random DocType that is not Excel (i.e. not DI_UNG or DINH_DUONG) if not set or empty
    let docTypes = form.getFieldValue("DocTypes") || [];
    if (docTypes.length === 0) {
      const allowedTypes = Object.values(DocType).filter(
        (t) => t !== DocType.DI_UNG && t !== DocType.DINH_DUONG
      );
      docTypes = [allowedTypes[Math.floor(Math.random() * allowedTypes.length)]];
    }

    const docTypeSuffix = docTypes[0] || "COA";
    const generatedDocCode = `${docTypeSuffix}-NCC-${Math.floor(1000 + Math.random() * 9000)}`;

    form.setFieldsValue({
      DocTypes: docTypes,
      PartnerId: partnerId,
      ItemCodes: selectedItemCodes,
      DocCode: generatedDocCode,
      DocName: `Chứng từ ${docTypeSuffix} - ${docNameWithoutExt}`,
      ValidFrom: dayjs(),
      ValidTo: dayjs().add(1, "year"),
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

  const requestPartnerId = Form.useWatch("PartnerId", requestForm);
  const requestDocTypes = Form.useWatch("DocTypes", requestForm) || [];

  React.useEffect(() => {
    if (isRequestModalVisible) {
      const partner = partners.find((p) => p.PartnerId === requestPartnerId);
      const partnerName = partner ? partner.PartnerName : "[Tên đối tác]";
      const email = partner ? `qa@${partner.PartnerCode.toLowerCase()}.com.vn` : "";
      
      const docTypeTexts = requestDocTypes.map((type: DocType) => {
        const details = getDocTypeDetails(type);
        return `- ${details.text}`;
      }).join("\n") || "- [Danh sách các chứng từ chưa chọn]";

      const content = `Kính gửi quý Đối tác ${partnerName},

Bộ phận Quản lý Chất lượng QA - Masan Consumer kính đề nghị Quý đối tác vui lòng bổ sinh các chứng từ kiểm soát chất lượng còn thiếu dưới đây:
${docTypeTexts}

Kính đề nghị Quý đối tác phản hồi và bổ sung các chứng từ này sớm nhất có thể để đảm bảo tuân thủ tiêu chuẩn chất lượng Masan Consumer. Quý đối tác có thể gửi lại qua email này hoặc tải trực tiếp lên hệ thống Masan Trace.

Trân trọng cảm ơn sự phối hợp của Quý đối tác!

--
Bộ phận QA - Masan Consumer`;

      const subject = `[Yêu cầu bổ sung chứng từ] Thư yêu cầu từ Bộ phận QA - Masan Consumer`;

      requestForm.setFieldsValue({
        recipient: email,
        subject: subject,
        content: content,
      });
    }
  }, [requestPartnerId, requestDocTypes, isRequestModalVisible, partners]);



  // Helper: Format Dates
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "Không thời hạn";
    return dayjs(date).format("YYYY-MM-DD");
  };

  // Helper: Calculate Validity Status
  const getDocValidityStatus = (doc: Doc) => {
    const today = dayjs().startOf("day");
    const validFrom = dayjs(doc.ValidFrom).startOf("day");
    const validTo = doc.ValidTo ? dayjs(doc.ValidTo).startOf("day") : null;

    if (validFrom.isAfter(today)) {
      return {
        text: "Chưa hiệu lực",
        color: "blue",
        status: "PENDING_VALIDITY",
      };
    }
    if (validTo) {
      if (validTo.isBefore(today)) {
        return { text: "Hết hiệu lực", color: "red", status: "EXPIRED" };
      }
      if (validTo.diff(today, "day") <= 30) {
        return {
          text: "Sắp hết hạn",
          color: "orange",
          status: "EXPIRING_SOON",
        };
      }
    }
    return { text: "Đang hiệu lực", color: "green", status: "ACTIVE" };
  };

  const getMockDocHistoryData = (record: Doc) => {
    const partner = partners.find((p) => p.PartnerId === record.PartnerId);
    const partnerName = partner ? partner.PartnerName : "N/A";
    
    return [
      {
        key: "1",
        time: record.ValidFrom 
          ? dayjs(record.ValidFrom).subtract(4, "day").format("YYYY-MM-DD HH:mm") 
          : "2026-07-05 10:00",
        user: partnerName + " (Nhân viên tải lên)",
        type: "Khởi tạo chứng từ",
        details: `Nhà cung cấp đăng tải chứng từ mới: ${record.DocName} (Phiên bản v${record.Version}). Mã chứng từ: ${record.DocCode}.`,
        status: "APPROVED",
        approver: "Hồ Hoàng Long (QA Officer)",
        approveTime: record.ValidFrom 
          ? dayjs(record.ValidFrom).subtract(4, "day").add(6, "hour").format("YYYY-MM-DD HH:mm") 
          : "2026-07-05 16:00",
      },
      {
        key: "2",
        time: record.ValidFrom 
          ? dayjs(record.ValidFrom).subtract(1, "day").format("YYYY-MM-DD HH:mm") 
          : "2026-07-08 09:30",
        user: "Hồ Hoàng Long (QA Officer)",
        type: "Yêu cầu rà soát",
        details: `Yêu cầu đối tác bổ sung/cập nhật thông tin các mã vật tư liên kết: ${record.DocItems?.map((di) => di.ItemCode).join(", ") || "N/A"}.`,
        status: "APPROVED",
        approver: "Trần Quốc Bảo (QA Manager)",
        approveTime: record.ValidFrom 
          ? dayjs(record.ValidFrom).subtract(1, "day").add(3, "hour").format("YYYY-MM-DD HH:mm") 
          : "2026-07-08 12:30",
      },
      {
        key: "3",
        time: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm"),
        user: partnerName + " (Nhân viên tải lên)",
        type: "Tải lên bản cập nhật",
        details: `Tải lên file tài liệu đính kèm mới thay thế do điều chỉnh ngày hết hạn: ${record.ValidTo ? formatDate(record.ValidTo) : "Vô thời hạn"}.`,
        status: "PENDING",
        approver: "-",
        approveTime: "-",
      }
    ];
  };

  // Helper: Map DocType to Badge details
  const getDocTypeDetails = (type: DocType) => {
    switch (type) {
      case DocType.COA:
        return { text: "COA (Phân tích chất lượng)", color: "green" };
      case DocType.SPECIFICATION:
        return { text: "Specification (Đặc tính kỹ thuật)", color: "gold" };
      case DocType.HSCB:
        return { text: "Hồ sơ công bố (HSCB)", color: "red" };
      case DocType.TCCS:
        return { text: "Tiêu chuẩn cơ sở (TCCS)", color: "blue" };
      case DocType.DI_UNG:
        return { text: "Cảnh báo dị ứng", color: "purple" };
      case DocType.DINH_DUONG:
        return { text: "Thông tin dinh dưỡng", color: "magenta" };
      case DocType.CERTIFICATE:
        return { text: "Chứng chỉ chất lượng (ISO/HACCP...)", color: "cyan" };
      case DocType.HDSD:
        return { text: "Hướng dẫn sử dụng", color: "orange" };
      case DocType.HD_BAO_QUAN:
        return { text: "Hướng dẫn bảo quản", color: "lime" };
      case DocType.CO_KQKN:
        return { text: "Chứng nhận C/O / KQ Kiểm nghiệm", color: "geekblue" };
      case DocType.KIEM_DICH:
        return { text: "Giấy kiểm dịch", color: "volcano" };
      default:
        return { text: type || "Khác (OTHER)", color: "default" };
    }
  };

  // Filtered items list of type RM or PG for the Form dropdown
  const rmandPgItems = items.filter(
    (i) => i.ItemType === "RM" || i.ItemType === "PG",
  );

  // Dynamic filter: itemCode filtered by selected partner in form
  const filteredItemOptions = React.useMemo(() => {
    if (!selectedPartnerId) return [];
    const mappedItemCodes = partnerMappings
      .filter((m) => m.PartnerId === selectedPartnerId)
      .map((m) => m.ItemCode);
    return rmandPgItems.filter((item) =>
      mappedItemCodes.includes(item.ItemCode),
    );
  }, [selectedPartnerId, partnerMappings, rmandPgItems]);

  // Filter Logic
  const filteredDocs = docs.filter((doc) => {
    // 1. Text Search
    const partnerInfo = partners.find((p) => p.PartnerId === doc.PartnerId);
    const searchLower = searchText.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      doc.DocCode.toLowerCase().includes(searchLower) ||
      doc.DocName.toLowerCase().includes(searchLower) ||
      (partnerInfo &&
        (partnerInfo.PartnerCode.toLowerCase().includes(searchLower) ||
          partnerInfo.PartnerName.toLowerCase().includes(searchLower))) ||
      doc.DocItems?.some((di) =>
        di.ItemCode.toLowerCase().includes(searchLower),
      ) ||
      false;

    // 2. Doc Type Filter
    const matchesDocType =
      selectedDocType === "ALL" || doc.DocType === selectedDocType;

    // 3. Partner Filter
    const matchesPartner =
      selectedPartner === "ALL" || doc.PartnerId === selectedPartner;

    // 4. Approval Status Filter
    const matchesStatus =
      selectedStatus === "ALL" || doc.Status === selectedStatus;

    // 5. Validity Status Filter
    let matchesValidity = true;
    if (selectedValidity !== "ALL") {
      const valStatus = getDocValidityStatus(doc);
      if (selectedValidity === "ACTIVE") {
        matchesValidity = valStatus.status === "ACTIVE" || valStatus.status === "EXPIRING_SOON";
      } else {
        matchesValidity = valStatus.status === selectedValidity;
      }
    }

    return (
      matchesSearch &&
      matchesDocType &&
      matchesPartner &&
      matchesStatus &&
      matchesValidity
    );
  });

  // Action handlers
  const handleApprove = (docId: string) => {
    dispatch(approveDoc(docId));
    message.success("Phê duyệt chứng từ thành công!");
    if (selectedDetailDoc && selectedDetailDoc.DocId === docId) {
      setSelectedDetailDoc({
        ...selectedDetailDoc,
        Status: DocStatus.APPROVED,
      });
    }
  };

  const handleReject = (docId: string) => {
    dispatch(rejectDoc(docId));
    message.error("Từ chối chứng từ thành công!");
    if (selectedDetailDoc && selectedDetailDoc.DocId === docId) {
      setSelectedDetailDoc({
        ...selectedDetailDoc,
        Status: DocStatus.REJECTED,
      });
    }
  };

  const handleOpenMailModal = (doc: Doc) => {
    setSelectedMailDoc(doc);
    const partner = partners.find((p) => p.PartnerId === doc.PartnerId);
    const partnerName = partner ? partner.PartnerName : "N/A";
    const partnerCode = partner ? partner.PartnerCode : "N/A";
    const email = partner ? `qa@${partner.PartnerCode.toLowerCase()}.com.vn` : "qa@partner.com.vn";

    const validityStatus = getDocValidityStatus(doc);
    const isExpired = validityStatus.status === "EXPIRED";
    const isExpiringSoon = validityStatus.status === "EXPIRING_SOON";

    let expirationMessage = "";
    if (isExpired) {
      expirationMessage = `đã HẾT HIỆU LỰC từ ngày ${formatDate(doc.ValidTo)}`;
    } else if (isExpiringSoon) {
      const daysLeft = doc.ValidTo ? dayjs(doc.ValidTo).diff(dayjs().startOf("day"), "day") : 0;
      expirationMessage = `sắp hết hiệu lực (còn ${daysLeft} ngày, sẽ hết hạn vào ngày ${formatDate(doc.ValidTo)})`;
    } else {
      expirationMessage = doc.ValidTo ? `sẽ hết hiệu lực vào ngày ${formatDate(doc.ValidTo)}` : "vô thời hạn";
    }

    const typeDetails = getDocTypeDetails(doc.DocType);
    const typeText = typeDetails.text;

    const docItemsList = doc.DocItems?.map(di => di.ItemCode).join(", ") || "-";

    const subject = isExpired
      ? `[CẢNH BÁO HẾT HẠN] Yêu cầu cập nhật chứng từ: ${doc.DocCode} - ${doc.DocName}`
      : `[CẢNH BÁO SẮP HẾT HẠN] Yêu cầu cập nhật chứng từ: ${doc.DocCode} - ${doc.DocName}`;

    const content = `Kính gửi quý Đối tác,

Bộ phận Quản lý Chất lượng QA - Masan Consumer xin thông báo về tình trạng chứng từ của quý đối tác như sau:
- Loại chứng từ: ${typeText}
- Mã chứng từ: ${doc.DocCode}
- Tên chứng từ: ${doc.DocName}
- Đối tác sở hữu: ${partnerCode} - ${partnerName}
- Tình trạng: ${expirationMessage}
- Vật tư áp dụng: ${docItemsList}

Kính đề nghị Quý đối tác sớm cập nhật và tải lên tài liệu chứng từ mới nhất lên hệ thống Masan Trace để tránh làm gián đoạn quá trình giao nhận hàng và kiểm soát chất lượng đầu vào.

Mọi thắc mắc vui lòng phản hồi email này hoặc liên hệ hotline QA Masan Consumer.
Trân trọng cảm ơn sự hợp tác của Quý đối tác!

--
Bộ phận QA - Masan Consumer`;

    mailForm.setFieldsValue({
      recipient: email,
      subject: subject,
      content: content,
    });
    setIsMailModalVisible(true);
  };

  const handleSendMail = (values: any) => {
    setIsSendingMail(true);
    setTimeout(() => {
      setIsSendingMail(false);
      setIsMailModalVisible(false);
      setSelectedMailDoc(null);
      mailForm.resetFields();
      message.success(`Gửi email cảnh báo chứng từ ${selectedMailDoc?.DocCode} thành công đến ${values.recipient}!`);
    }, 1200);
  };

  const handleSendRequestMail = (values: any) => {
    setIsSendingRequestMail(true);
    setTimeout(() => {
      setIsSendingRequestMail(false);
      setIsRequestModalVisible(false);
      requestForm.resetFields();
      message.success(`Gửi email yêu cầu bổ sung chứng từ thành công đến ${values.recipient}!`);
    }, 1200);
  };

  const handlePreviewUploadedPdf = () => {
    const fileList = form.getFieldsValue().fileUpload || [];
    if (fileList.length > 0) {
      const file = fileList[0];
      const fileObj = file.originFileObj;
      let fileUrl = "";
      if (fileObj) {
        fileUrl = URL.createObjectURL(fileObj);
      } else {
        fileUrl = `/files/${file.name}`;
      }
      setSelectedPdfUrl(fileUrl);
      setSelectedPdfTitle(file.name || "Tài liệu xem trước");
      setIsPdfDrawerOpen(true);
    } else {
      message.error("Vui lòng tải lên file để xem trước!");
    }
  };

  const handleAddDocs = (values: any) => {
    const fileList = values.fileUpload || [];
    const docTypes: DocType[] = values.DocTypes || [];

    if (docTypes.length === 0) {
      message.error("Vui lòng chọn ít nhất một loại chứng từ!");
      return;
    }

    // Determine placeholder URL based on type
    const hasExcelType = docTypes.some(
      (t) => t === DocType.DI_UNG || t === DocType.DINH_DUONG,
    );
    const defaultPlaceholder = hasExcelType
      ? "/files/document_placeholder.xlsx"
      : "/files/document_placeholder.pdf";

    let fileUrl = defaultPlaceholder;
    if (fileList.length > 0) {
      const fileObj = fileList[0].originFileObj;
      if (fileObj) {
        fileUrl = URL.createObjectURL(fileObj);
      } else {
        fileUrl = `/files/${fileList[0].name}`;
      }
    }

    const baseId = Date.now();
    const isMultiple = docTypes.length > 1;

    docTypes.forEach((type, index) => {
      const newDocId = `DOC-NEW-${baseId}-${index}`;
      const typeDetails = getDocTypeDetails(type);
      const newDocCode = isMultiple
        ? `${values.DocCode}-${type}`
        : values.DocCode;
      const newDocName = isMultiple
        ? `${values.DocName} (${typeDetails.text})`
        : values.DocName;

      const newDoc: Doc = {
        DocId: newDocId,
        PartnerId: values.PartnerId,
        DocCode: newDocCode,
        Version: values.Version || "1",
        DocType: type,
        DocName: newDocName,
        FileURL: fileUrl,
        ValidFrom: values.ValidFrom
          ? values.ValidFrom.format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        ValidTo: values.ValidTo ? values.ValidTo.format("YYYY-MM-DD") : null,
        Status: DocStatus.PENDING,
        DocItems: (values.ItemCodes || []).map(
          (code: string, iIdx: number) => ({
            DocItemId: `DOC-ITEM-NEW-${baseId}-${index}-${iIdx}`,
            DocId: newDocId,
            ItemCode: code,
          }),
        ),
      };
      dispatch(addDoc(newDoc));
    });

    message.success(`Thêm mới ${docTypes.length} chứng từ thành công!`);
    setIsAddModalVisible(false);
    form.resetFields();
    setIsPreviewDrawerOpen(false);
    setPreviewDocType(null);
  };

  // Table Columns Setup
  const columns = [
    {
      title: "Mã Chứng Từ",
      key: "DocCode",
      width: 200,
      fixed: "left" as any,
      align: "center" as const,
      render: (record: Doc) => (
        <strong style={{ color: "#096dd9" }}>
          {record.DocCode}
        </strong>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "Status",
      key: "Status",
      width: 120,
      fixed: "left" as any,
      align: "center" as const,
      render: (status: DocStatus) => {
        switch (status) {
          case DocStatus.APPROVED:
            return <Tag color="success">Đã duyệt</Tag>;
          case DocStatus.REJECTED:
            return <Tag color="error">Từ chối</Tag>;
          default:
            return <Tag color="warning">Chờ duyệt</Tag>;
        }
      },
    },
    {
      title: "Tên Chứng Từ",
      dataIndex: "DocName",
      key: "DocName",
      width: 350,
    },
    {
      title: "Loại Chứng Từ",
      dataIndex: "DocType",
      key: "DocType",
      width: 250,
      align: "center" as const,
      render: (type: DocType) => {
        const details = getDocTypeDetails(type);
        return <Tag color={details.color}>{details.text}</Tag>;
      },
    },
    {
      title: "Mã Đối Tác",
      key: "PartnerCode",
      width: 150,
      align: "center" as const,
      render: (record: Doc) => {
        const partner = partners.find((p) => p.PartnerId === record.PartnerId);
        if (!partner) return <span style={{ color: "#bfbfbf" }}>-</span>;
        return (
          <Space>
            <Tag
              color={
                partner.PartnerType === PartnerType.NCC ? "cyan" : "geekblue"
              }
            >
              {partner.PartnerType}
            </Tag>
            <span style={{ fontWeight: 500 }}>{partner.PartnerCode}</span>
          </Space>
        );
      },
    },
    {
      title: "Tên Đối Tác",
      key: "PartnerName",
      width: 400,
      render: (record: Doc) => {
        const partner = partners.find((p) => p.PartnerId === record.PartnerId);
        if (!partner) return "-";
        return partner.PartnerName;
      },
    },
    {
      title: "Vật Tư Áp Dụng",
      key: "DocItems",
      width: 140,
      render: (record: Doc) => {
        if (!record.DocItems || record.DocItems.length === 0) return "-";
        return (
          <Space size={[0, 4]} wrap>
            {record.DocItems.map((di) => {
              const matchedItem = items.find((i) => i.ItemCode === di.ItemCode);
              return (
                <Tooltip
                  key={di.DocItemId}
                  title={
                    matchedItem
                      ? matchedItem.ItemName
                      : "Không tìm thấy thông tin"
                  }
                >
                  <Tag color="blue" style={{ cursor: "help", margin: 0 }}>
                    {di.ItemCode}
                  </Tag>
                </Tooltip>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "ValidFrom",
      key: "ValidFrom",
      width: 140,
      align: "center" as const,
      render: (val: any) => formatDate(val),
    },
    {
      title: "Hiệu lực đến",
      dataIndex: "ValidTo",
      key: "ValidTo",
      width: 140,
      align: "center" as const,
      render: (val: any) => (val ? formatDate(val) : "-"),
    },
    {
      title: "Hiệu lực",
      key: "Validity",
      width: 120,
      align: "center" as const,
      render: (record: Doc) => {
        const valStatus = getDocValidityStatus(record);
        return <Tag color={valStatus.color}>{valStatus.text}</Tag>;
      },
    },

    {
      title: "Tài liệu",
      key: "File",
      width: 120,
      align: "center" as const,
      render: (record: Doc) => {
        if (!record.FileURL) return "-";
        const isExcel =
          record.FileURL.endsWith(".xlsx") || record.FileURL.endsWith(".xls");
        return (
          <Tooltip title={isExcel ? "Xem file Excel" : "Xem file PDF"}>
            <Button
              type="text"
              danger={!isExcel}
              style={isExcel ? { color: "#52c41a" } : undefined}
              icon={
                isExcel ? (
                  <FileExcelOutlined style={{ fontSize: "20px" }} />
                ) : (
                  <FilePdfOutlined style={{ fontSize: "20px" }} />
                )
              }
              onClick={() => {
                if (isExcel) {
                  setPreviewDocType(record.DocType);
                  setIsPreviewDrawerOpen(true);
                } else {
                  setSelectedPdfUrl("/files/document_placeholder.pdf");
                  setSelectedPdfTitle(record.DocName);
                  setIsPdfDrawerOpen(true);
                }
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Hành động",
      key: "Actions",
      width: 200,
      fixed: "right" as any,
      align: "center" as const,
      render: (record: Doc) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                setSelectedDetailDoc(record);
                setIsDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cảnh báo hết hạn">
            <Button
              type="default"
              icon={<MailOutlined style={{ fontSize: "16px", color: PRIMARY_COLOR }} />}
              onClick={() => handleOpenMailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Lịch sử thay đổi">
            <Button
              icon={
                <HistoryOutlined
                  style={{ fontSize: "16px", color: PRIMARY_COLOR }}
                />
              }
              onClick={() => {
                setSelectedHistoryDoc(record);
                setIsHistoryModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
                Tìm kiếm nhanh:
              </div>
              <Input
                placeholder="Mã/tên CT, đối tác, vật tư..."
                value={tempSearchText}
                onChange={(e) => setTempSearchText(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                allowClear
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Loại chứng từ:
              </div>
              <Select
                value={tempDocType}
                onChange={(val) => setTempDocType(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả chứng từ</Select.Option>
                {Object.values(DocType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {getDocTypeDetails(type).text}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Đối tác NCC / NSX:
              </div>
              <Select
                value={tempPartner}
                onChange={(val) => setTempPartner(val)}
                style={{ width: "100%" }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "ALL", label: "Tất cả đối tác" },
                  ...partners.map((p) => ({
                    value: p.PartnerId,
                    label: `[${p.PartnerType}] ${p.PartnerCode} - ${p.PartnerName}`,
                  })),
                ]}
              />
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Trạng thái phê duyệt:
              </div>
              <Select
                value={tempStatus}
                onChange={(val) => setTempStatus(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                <Select.Option value={DocStatus.PENDING}>
                  Chờ duyệt
                </Select.Option>
                <Select.Option value={DocStatus.APPROVED}>
                  Đã duyệt
                </Select.Option>
                <Select.Option value={DocStatus.REJECTED}>
                  Từ chối
                </Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <div
                style={{ marginBottom: 4, fontWeight: 500, fontSize: "13px" }}
              >
                Hiệu lực:
              </div>
              <Select
                value={tempValidity}
                onChange={(val) => setTempValidity(val)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ALL">Tất cả hiệu lực</Select.Option>
                <Select.Option value="ACTIVE">Đang hiệu lực</Select.Option>
                <Select.Option value="EXPIRING_SOON">Sắp hết hạn</Select.Option>
                <Select.Option value="EXPIRED">Hết hiệu lực</Select.Option>
                <Select.Option value="PENDING_VALIDITY">
                  Chưa hiệu lực
                </Select.Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={18}>
              <Space size="middle" style={{ width: "100%" }}>
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
                  onClick={() => setIsAddModalVisible(true)}
                >
                  Thêm chứng từ NCC
                </Button>
                <Button
                  type="default"
                  icon={<MailOutlined />}
                  onClick={() => setIsRequestModalVisible(true)}
                  style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                >
                  Email YC Bổ sung
                </Button>
              </Space>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      {/* Main Table */}
      <AppTable
        dataSource={filteredDocs}
        columns={columns}
        rowKey="DocId"
        scroll={{ x: 2220 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        bordered
        size="middle"
      />

      {/* AI Loading Modal */}
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
              AI Extracting: Đang phân rã thông tin
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

      {/* Add Document Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <PlusOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Khai báo chứng từ NCC mới
          </span>
        }
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
          setIsPreviewDrawerOpen(false);
          setPreviewDocType(null);
        }}
        onOk={() => form.submit()}
        width={800}
        okText="Lưu chứng từ"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAddDocs}>
          {/* 1. Loại Chứng Từ (Đưa lên đầu, multi select) */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="DocTypes"
                label="Loại Chứng Từ"
                rules={[
                  { required: true, message: "Vui lòng chọn loại chứng từ!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn loại chứng từ..."
                  allowClear
                >
                  {Object.values(DocType).map((type) => (
                    <Select.Option key={type} value={type}>
                      {getDocTypeDetails(type).text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Template Selection mapping when DI_UNG or DINH_DUONG is selected */}
            {(formDocTypes.includes(DocType.DI_UNG) ||
              formDocTypes.includes(DocType.DINH_DUONG)) && (
              <Col span={12}>
                <Form.Item
                  name="templateCode"
                  label="Chọn Template áp dụng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn template áp dụng!",
                    },
                  ]}
                >
                  <Select placeholder="Chọn template mẫu đối chiếu...">
                    {formDocTypes.includes(DocType.DI_UNG) && (
                      <Select.Option value="TEMPLATE_DI_UNG">
                        TEMPLATE_DI_UNG - Template Cấu hình Chỉ tiêu Dị ứng
                      </Select.Option>
                    )}
                    {formDocTypes.includes(DocType.DINH_DUONG) && (
                      <Select.Option value="TEMPLATE_DINH_DUONG">
                        TEMPLATE_DINH_DUONG - Template Cấu hình Thành phần Dinh
                        dưỡng
                      </Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            )}

            {/* 2. Đối tác sở hữu (NCC / NSX) */}
            <Col span={12}>
              <Form.Item
                name="PartnerId"
                label="Đối tác sở hữu (NCC / NSX)"
                rules={[
                  { required: true, message: "Vui lòng chọn đối tác sở hữu!" },
                ]}
              >
                <Select
                  placeholder="Chọn NCC hoặc NSX..."
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={partners.map((p) => ({
                    value: p.PartnerId,
                    label: `[${p.PartnerType}] ${p.PartnerCode} - ${p.PartnerName}`,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 3. Áp dụng cho các vật tư (ItemCode) - filter theo PartnerId */}
          <Form.Item
            name="ItemCodes"
            label="Áp dụng cho các vật tư (ItemCode)"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một vật tư áp dụng!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder={
                selectedPartnerId
                  ? "Chọn các mã vật tư..."
                  : "Vui lòng chọn đối tác sở hữu trước..."
              }
              disabled={!selectedPartnerId}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={filteredItemOptions.map((item) => ({
                value: item.ItemCode,
                label: `${item.ItemCode} - ${item.ItemName} (${item.ItemType})`,
              }))}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="DocCode"
                label="Mã Chứng Từ"
                rules={[
                  { required: true, message: "Vui lòng nhập Mã chứng từ!" },
                ]}
              >
                <Input placeholder="Ví dụ: COA-GAVI-2026" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="DocName"
                label="Tên Chứng Từ"
                rules={[
                  { required: true, message: "Vui lòng nhập Tên chứng từ!" },
                ]}
              >
                <Input placeholder="Ví dụ: Bản kết quả phân tích chất lượng hành sấy" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ValidFrom"
                label="Ngày bắt đầu hiệu lực"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hiệu lực!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ValidTo" label="Ngày hết hiệu lực">
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 4. Upload Area (Excel if DI_UNG or DINH_DUONG, PDF otherwise) */}
          {(() => {
            const isExcelUpload =
              formDocTypes.includes(DocType.DI_UNG) ||
              formDocTypes.includes(DocType.DINH_DUONG);
            return (
              <>
                <Form.Item
                  name="fileUpload"
                  label={
                    isExcelUpload
                      ? "File Chứng Từ Đính Kèm (Excel)"
                      : "File Chứng Từ Đính Kèm (PDF)"
                  }
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                  }}
                  style={{
                    marginBottom:
                      fileUploadList && fileUploadList.length > 0
                        ? "8px"
                        : "24px",
                  }}
                >
                  <Upload.Dragger
                    name="files"
                    accept={isExcelUpload ? ".xlsx,.xls" : ".pdf"}
                    beforeUpload={(file) => {
                      if (!isExcelUpload) {
                        handleAiParsing(file);
                      }
                      return false;
                    }}
                    maxCount={1}
                    showUploadList={false}
                    onChange={(info) => {
                      if (isExcelUpload) {
                        const fileList = info.fileList || [];
                        if (fileList.length > 0) {
                          const firstExcelType = formDocTypes.find(
                            (t: DocType) =>
                              t === DocType.DI_UNG || t === DocType.DINH_DUONG,
                          );
                          setPreviewDocType(firstExcelType || null);
                          message.loading({
                            content: "Đang đọc dữ liệu từ file Excel...",
                            key: "read-supplier-excel",
                          });
                          setTimeout(() => {
                            message.success({
                              content: "Đọc file Excel thành công!",
                              key: "read-supplier-excel",
                              duration: 2,
                            });
                            setIsPreviewDrawerOpen(true);
                          }, 500);
                        } else {
                          setIsPreviewDrawerOpen(false);
                          setPreviewDocType(null);
                        }
                      }
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      {isExcelUpload
                        ? "Kéo thả file Excel (.xlsx, .xls) hoặc nhấp chọn để tải lên"
                        : "Kéo thả file PDF hoặc nhấp chọn để tải lên"}
                    </p>
                  </Upload.Dragger>
                </Form.Item>

                {/* Custom Uploaded File Card with Preview and Delete Action */}
                {fileUploadList &&
                  fileUploadList.length > 0 &&
                  (() => {
                    const file = fileUploadList[0];
                    const isExcel =
                      file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
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
                            {isExcel ? (
                              <FileExcelOutlined
                                style={{ color: "#52c41a", fontSize: "20px" }}
                              />
                            ) : (
                              <FilePdfOutlined
                                style={{ color: "#ff4d4f", fontSize: "20px" }}
                              />
                            )}
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
                              {isExcel
                                ? "Đã phân tích dữ liệu Excel thành công"
                                : "Trích xuất dữ liệu bằng AI thành công"}
                            </span>
                          </div>
                        </div>
                        <Space size="middle">
                          <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => {
                              if (isExcel) {
                                const firstExcelType = formDocTypes.find(
                                  (t: DocType) =>
                                    t === DocType.DI_UNG ||
                                    t === DocType.DINH_DUONG,
                                );
                                setPreviewDocType(firstExcelType || null);
                                setIsPreviewDrawerOpen(true);
                              } else {
                                handlePreviewUploadedPdf();
                              }
                            }}
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
                            {isExcel ? "Xóa" : "Xóa file"}
                          </Button>
                        </Space>
                      </div>
                    );
                  })()}
              </>
            );
          })()}
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <InfoCircleOutlined
              style={{ color: PRIMARY_COLOR, marginRight: "8px" }}
            />
            Chi tiết chứng từ NCC
          </span>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedDetailDoc(null);
        }}
        footer={[
          selectedDetailDoc &&
            selectedDetailDoc.Status === DocStatus.PENDING && (
              <React.Fragment key="qa-actions">
                <Button
                  type="primary"
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleApprove(selectedDetailDoc.DocId);
                    setIsDetailModalVisible(false);
                    setSelectedDetailDoc(null);
                  }}
                >
                  Phê duyệt
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleReject(selectedDetailDoc.DocId);
                    setIsDetailModalVisible(false);
                    setSelectedDetailDoc(null);
                  }}
                >
                  Từ chối
                </Button>
              </React.Fragment>
            ),
          <Button
            key="close"
            type="default"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedDetailDoc(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedDetailDoc &&
          (() => {
            const partnerInfo = partners.find(
              (p) => p.PartnerId === selectedDetailDoc.PartnerId,
            );
            const valStatus = getDocValidityStatus(selectedDetailDoc);
            const typeDetails = getDocTypeDetails(selectedDetailDoc.DocType);

            return (
              <div style={{ marginTop: "16px" }}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Mã Chứng Từ" span={2}>
                    <strong>{selectedDetailDoc.DocCode}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên Chứng Từ" span={2}>
                    {selectedDetailDoc.DocName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại Chứng Từ">
                    <Tag color={typeDetails.color}>{typeDetails.text}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phiên Bản / Version">
                    Bản {selectedDetailDoc.Version}
                  </Descriptions.Item>
                  <Descriptions.Item label="Có hiệu lực từ">
                    {formatDate(selectedDetailDoc.ValidFrom)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Có hiệu lực đến">
                    {formatDate(selectedDetailDoc.ValidTo)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái hiệu lực">
                    <Tag color={valStatus.color}>{valStatus.text}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái phê duyệt">
                    {selectedDetailDoc.Status === DocStatus.APPROVED && (
                      <Tag color="success">Đã duyệt</Tag>
                    )}
                    {selectedDetailDoc.Status === DocStatus.REJECTED && (
                      <Tag color="error">Từ chối</Tag>
                    )}
                    {selectedDetailDoc.Status === DocStatus.PENDING && (
                      <Tag color="warning">Chờ duyệt</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đối Tác" span={2}>
                    {partnerInfo ? (
                      <div>
                        <strong>{partnerInfo.PartnerCode}</strong> -{" "}
                        {partnerInfo.PartnerName}
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginTop: "4px",
                          }}
                        >
                          Phân loại:{" "}
                          {partnerInfo.PartnerType === PartnerType.NCC
                            ? "Nhà cung cấp (NCC)"
                            : "Nhà sản xuất (NSX)"}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                  {selectedDetailDoc.FileURL && (
                    <Descriptions.Item label="File Chứng Từ" span={2}>
                      <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => {
                          setSelectedPdfUrl("/files/document_placeholder.pdf");
                          setSelectedPdfTitle(selectedDetailDoc.DocName);
                          setIsPdfDrawerOpen(true);
                        }}
                      >
                        <Space>
                          <FilePdfOutlined
                            style={{ color: "#ff4d4f", fontSize: "16px" }}
                          />
                          Xem File PDF Chứng Từ
                        </Space>
                      </Button>
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <Divider
                  orientation={"left" as any}
                  style={{ margin: "20px 0 10px 0" }}
                >
                  Danh sách vật tư liên kết
                </Divider>

                <AppTable
                  dataSource={selectedDetailDoc.DocItems || []}
                  rowKey="DocItemId"
                  pagination={false}
                  bordered
                  size="small"
                  columns={[
                    {
                      title: "Mã Vật Tư (ItemCode)",
                      dataIndex: "ItemCode",
                      key: "ItemCode",
                      render: (code: string) => <Tag color="blue">{code}</Tag>,
                    },
                    {
                      title: "Tên Vật Tư",
                      key: "ItemName",
                      render: (record: any) => {
                        const matched = items.find(
                          (i) => i.ItemCode === record.ItemCode,
                        );
                        return matched ? matched.ItemName : "-";
                      },
                    },
                    {
                      title: "Phân Loại",
                      key: "ItemType",
                      render: (record: any) => {
                        const matched = items.find(
                          (i) => i.ItemCode === record.ItemCode,
                        );
                        if (!matched) return "-";
                        return matched.ItemType === "RM"
                          ? "Nguyên liệu (RM)"
                          : "Bao bì (PG)";
                      },
                    },
                  ]}
                  locale={{ emptyText: "Không có vật tư nào liên kết" }}
                />
              </div>
            );
          })()}
      </Modal>

      {/* 4.1. Supplier Doc Revision History Modal */}
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
            <HistoryOutlined style={{ fontSize: "18px", color: PRIMARY_COLOR }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Lịch sử Thay đổi & Phê duyệt - {selectedHistoryDoc?.DocCode}
            </span>
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setSelectedHistoryDoc(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsHistoryModalVisible(false);
              setSelectedHistoryDoc(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedHistoryDoc && (
          <div style={{ marginTop: "15px" }}>
            <Descriptions
              bordered
              size="small"
              column={2}
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Mã Chứng Từ">
                <strong>{selectedHistoryDoc.DocCode}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Tên chứng từ">
                <strong>{selectedHistoryDoc.DocName || "-"}</strong>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation={"left" as any} style={{ fontSize: "14px", fontWeight: 600, color: PRIMARY_COLOR }}>
              Nhật ký thay đổi chi tiết
            </Divider>

            <Table
              dataSource={getMockDocHistoryData(selectedHistoryDoc)}
              columns={[
                {
                  title: "Thời gian chỉnh",
                  dataIndex: "time",
                  key: "time",
                  width: 150,
                  render: (text: string) => <span style={{ color: "#595959" }}>{text}</span>,
                },
                {
                  title: "Người chỉnh",
                  dataIndex: "user",
                  key: "user",
                  width: 200,
                  render: (text: string) => <strong>{text}</strong>,
                },
                {
                  title: "Phân loại",
                  dataIndex: "type",
                  key: "type",
                  width: 140,
                  render: (text: string) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Chỉnh sửa thông tin gì",
                  dataIndex: "details",
                  key: "details",
                  render: (text: string) => <span style={{ fontSize: "13px" }}>{text}</span>,
                },
                {
                  title: "Lịch sử phê duyệt",
                  key: "status",
                  width: 240,
                  render: (record: any) => {
                    if (record.status === "APPROVED") {
                      return (
                        <div>
                          <Tag color="green" style={{ marginBottom: 4 }}>Đã phê duyệt</Tag>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Bởi: <strong>{record.approver}</strong>
                          </div>
                          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>
                            Lúc: {record.approveTime}
                          </div>
                        </div>
                      );
                    } else {
                      return <Tag color="gold">Chờ phê duyệt</Tag>;
                    }
                  },
                },
              ]}
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        )}
      </Modal>

      {/* Send Expiring Warning Mail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <MailOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Gửi email cảnh báo chứng từ sắp/hết hạn
          </span>
        }
        open={isMailModalVisible}
        onCancel={() => {
          setIsMailModalVisible(false);
          setSelectedMailDoc(null);
          mailForm.resetFields();
        }}
        onOk={() => mailForm.submit()}
        confirmLoading={isSendingMail}
        okText="Gửi Mail"
        cancelText="Hủy"
        width={650}
      >
        <Form
          form={mailForm}
          layout="vertical"
          onFinish={handleSendMail}
          style={{ marginTop: "15px" }}
        >
          <Form.Item
            name="recipient"
            label="Địa chỉ email nhận"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ email!" },
              { type: "email", message: "Địa chỉ email không hợp lệ!" }
            ]}
          >
            <Input placeholder="Nhập email đối tác..." />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Tiêu đề Email"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề email!" }]}
          >
            <Input placeholder="Nhập tiêu đề email..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung Email"
            rules={[{ required: true, message: "Vui lòng nhập nội dung email!" }]}
          >
            <Input.TextArea
              rows={12}
              placeholder="Nhập nội dung email cảnh báo..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Request Addition Document Mail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "bold", color: PRIMARY_COLOR }}>
            <MailOutlined style={{ color: PRIMARY_COLOR, marginRight: "8px" }} />
            Yêu cầu bổ sung chứng từ Nhà cung cấp
          </span>
        }
        open={isRequestModalVisible}
        onCancel={() => {
          setIsRequestModalVisible(false);
          requestForm.resetFields();
        }}
        onOk={() => requestForm.submit()}
        confirmLoading={isSendingRequestMail}
        okText="Gửi Yêu Cầu"
        cancelText="Hủy"
        width={700}
      >
        <Form
          form={requestForm}
          layout="vertical"
          onFinish={handleSendRequestMail}
          style={{ marginTop: "15px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="PartnerId"
                label="Chọn NCC / NSX"
                rules={[{ required: true, message: "Vui lòng chọn đối tác!" }]}
              >
                <Select
                  placeholder="Chọn đối tác cần bổ sung chứng từ..."
                  showSearch
                  optionFilterProp="children"
                >
                  {partners.map((p) => (
                    <Select.Option key={p.PartnerId} value={p.PartnerId}>
                      [{p.PartnerType}] {p.PartnerCode} - {p.PartnerName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="recipient"
                label="Email liên hệ đối tác"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Định dạng email không hợp lệ!" }
                ]}
              >
                <Input placeholder="Email liên hệ..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="DocTypes"
            label="Chọn loại chứng từ yêu cầu bổ sung"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một loại chứng từ!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các loại chứng từ cần bổ sung..."
              allowClear
            >
              {Object.values(DocType).map((type) => (
                <Select.Option key={type} value={type}>
                  {getDocTypeDetails(type).text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="Tiêu đề Email"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề email!" }]}
          >
            <Input placeholder="Nhập tiêu đề email..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung Email"
            rules={[{ required: true, message: "Vui lòng nhập nội dung email!" }]}
          >
            <Input.TextArea
              rows={12}
              placeholder="Nội dung email tự động tạo..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload Preview Drawer for Supplier Excel Files */}
      <Drawer
        title={
          <span style={{ fontWeight: "bold" }}>
            <FileExcelOutlined
              style={{ color: "#52c41a", marginRight: "8px" }}
            />
            Xem Trước Dữ Liệu Tải Lên: Template{" "}
            {previewDocType === DocType.DI_UNG ? "Dị ứng" : "Dinh dưỡng"} (Gốc)
          </span>
        }
        placement="right"
        width={800}
        onClose={() => {
          setIsPreviewDrawerOpen(false);
          setPreviewDocType(null);
        }}
        open={isPreviewDrawerOpen}
        footer={null}
      >
        {previewDocType && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Alert
              message="Đọc dữ liệu thành công từ file Excel"
              description="Hệ thống đã phân tích các chỉ tiêu và đối chiếu thành công với các ô định vị của template gốc:"
              type="success"
              showIcon
            />
            <h3 style={{ margin: "10px 0 0 0" }}>Cấu trúc ánh xạ chỉ tiêu:</h3>
            <AppTable
              dataSource={
                (previewDocType === DocType.DI_UNG
                  ? allergenTemplateData
                  : nutritionTemplateData) as any[]
              }
              columns={
                (previewDocType === DocType.DI_UNG
                  ? allergenColumns
                  : nutritionColumns) as any[]
              }
              pagination={false}
              bordered
              size="small"
            />
          </Space>
        )}
      </Drawer>

      {/* PDF Document Preview Drawer */}
      <Drawer
        title={
          <span style={{ fontWeight: "bold" }}>
            <FilePdfOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
            Tài Liệu: {selectedPdfTitle}
          </span>
        }
        placement="right"
        width="60%"
        onClose={() => {
          setIsPdfDrawerOpen(false);
          setSelectedPdfUrl("");
          setSelectedPdfTitle("");
        }}
        open={isPdfDrawerOpen}
        footer={null}
      >
        {selectedPdfUrl && (
          <div style={{ height: "100%", width: "100%" }}>
            <iframe
              src={selectedPdfUrl}
              title="PDF Document Viewer"
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "calc(100vh - 120px)" }}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DocList;
