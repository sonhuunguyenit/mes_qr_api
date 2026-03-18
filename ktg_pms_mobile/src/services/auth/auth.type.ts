export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  name: string;
  isAdmin: boolean;
  employeeId: string;
  enumData: EnumData;
  employeePosition: string[];
  userId: string;
  companyCode: string;
  listRoleSupplierNumber: any[];
  lstPermission: LstPermission[];
  listCompany: any[];
  employeeOrgPosition: string;
  departmentId: null;
  prType: any[];
  companyId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  data: {
    name?: string;
    accessToken?: string;
  };
}

interface LstPermission {
  code: string;
  name: string;
  path: string;
  permissionGroupIds: any[];
  view: boolean;
  edit: boolean;
  delete: boolean;
  add: boolean;
  watchAnother: boolean;
  editAnother: boolean;
}

interface EnumData {
  Page: Page;
  UserType: UserType;
  SiteEnum: SiteEnum;
  LockSupplier: LockSupplier;
  SupplierStatus: SupplierStatus;
  SupplierLegalStatus: SupplierLegalStatus;
  ReferenceInpectionLotType: ReferenceInpectionLotType;
  SupplierServiceStatus: SupplierServiceStatus;
  SupplierServiceStatusCapacity: SupplierServiceStatusCapacity;
  SupplierServiceExpertiseStatus: SupplierServiceExpertiseStatus;
  SupplierExpertiseStatus: SupplierExpertiseStatus;
  SupplierExpertiseLawStatus: SupplierExpertiseLawStatus;
  SupplierExpertiseCapacityStatus: SupplierExpertiseCapacityStatus;
  SupplierExpertiseDetailType: SupplierExpertiseDetailType;
  SettingStringType: SettingStringType;
  SettingStringClientType: SettingStringClientType;
  BannerClientType: BannerClientType;
  BannerClientPosition: BannerClientPosition;
  DataType: DataType;
  BidStatus: BidStatus;
  BidTechStatus: BidTechStatus;
  BidTradeStatus: BidTradeStatus;
  BidPriceStatus: BidTradeStatus;
  BidChooseSupplierStatus: BidChooseSupplierStatus;
  BidTechRateStatus: BidTechRateStatus;
  BidTradeRateStatus: BidTradeRateStatus;
  BidPriceRateStatus: BidTradeRateStatus;
  BidResetPriceStatus: BidResetPriceStatus;
  BidSupplierResetPriceStatus: BidSupplierResetPriceStatus;
  BidHistoryStatus: BidHistoryStatus;
  BidSupplierStatus: BidSupplierStatus;
  BidSupplierFileStatus: BidSupplierFileStatus;
  BidSupplierTechStatus: BidSupplierTechStatus;
  BidSupplierPriceStatus: BidSupplierTechStatus;
  BidSupplierTradeStatus: BidSupplierTechStatus;
  BidRuleType: BidRuleType;
  BidDealStatus: BidDealStatus;
  BidDealSupplierStatus: BidDealSupplierStatus;
  BidAuctionStatus: BidAuctionStatus;
  BidAuctionSupplierStatus: BidAuctionSupplierStatus;
  EmailTemplate: EmailTemplate;
  DataHistoryTable: DataHistoryTable;
  SQSMessageType: SQSMessageType;
  EmailStatus: EmailStatus;
  NotifyStatus: NotifyStatus;
  ColType: ColType;
  StatusServiceCapacity: StatusServiceCapacity;
  ContractStatus: ContractStatus;
  PORoleCode: PORoleCode;
  PaymentProgressStatus: PaymentProgressStatus;
  ContractTypeAppendix: ContractTypeAppendix;
  PurchaseOrderPayMent: PurchaseOrderPayMent;
  PurchaseOrderStatus: PurchaseOrderStatus;
  ShipmentConditionType: ShipmentConditionType;
  PRStatus: PRStatus;
  ContractTypePo: ContractTypePo;
  SourceType: SourceType;
  KPIRating: KPIRating;
  Evaluate: Evaluate;
  DatetimeQuarterly: DatetimeQuarterly;
  DatetimeFilter: DatetimeFilter;
  SchemeStatus: SchemeStatus;
  WarningType: WarningType;
  DataWarningType: DataWarningType;
  DeliveryDateStatus: DeliveryDateStatus;
  OutboundStatus: OutboundStatus;
  InboundStatus: InboundStatus;
  InboundItemLeadTimeType: InboundItemLeadTimeType;
  ShipmentStatus: ShipmentStatus;
  ShipmentV2Status: ShipmentV2Status;
  ShipmentV3Status: ShipmentV3Status;
  ShipmentTypeStatus: ShipmentStatus;
  ShipmentConsolidationStatus: ShipmentStatus;
  ShipmentRouteStatus: ShipmentRouteStatus;
  ShipmentRouteType: ShipmentRouteType;
  ShipmentCostStatus: ShipmentStatus;
  ShipmentCostTypeStatus: ShipmentStatus;
  ShipmentCostTypeGroupConditionStatus: ShipmentStatus;
  ShipmentCostTypeCondition: ShipmentStatus;
  ShipmentType: ShipmentType;
  SapShipmentType: SapShipmentType;
  ShipmentCostType: ShipmentCostType;
  ShipmentRoute: ShipmentRoute;
  ShippingType: ShippingType;
  ShippingCondition: ShippingCondition;
  PartnerFunction: PartnerFunction;
  CheckInventoryStatus: OutboundStatus;
  AuctionSupplierStatus: AuctionSupplierStatus;
  AuctionStatus: AuctionStatus;
  PriceScoreCalculateWay: PriceScoreCalculateWay;
  PoOrder: PoOrder;
  PercentageType: PercentageType;
  headerItemType: HeaderItemType;
  role: Role;
  PRType: PRType;
  Quotation: Quotation;
  PRAsyncStatus: PRAsyncStatus;
  BudgetStatus: BudgetStatus;
  PRStatusItem: PRStatusItem;
  BlockStatusItem: BlockStatusItem;
  ApproveStatus: ApproveStatus;
  FlowCode: FlowCode;
  sapCode: SapCode;
  APPROVE_TYPE: APPROVETYPE;
  RATE_TYPE: RATETYPE;
  PRSouceType: PRSouceType;
  supplierType: SupplierType;
  SupplierNumberSettingAction: SupplierNumberSettingAction;
  SupplierNumberAprovalStatus: SupplierNumberAprovalStatus;
  SupplierNumberSyncStatus: SupplierNumberSyncStatus;
  RequestUpdateStatus: RequestUpdateStatus;
  SupplierUpdateType: SupplierUpdateType;
  OfferSupplierStatus: OfferSupplierStatus;
  OfferStatus: OfferStatus;
  ReferenceType: ReferenceType;
  ValuationType: ValuationType;
  ZTCODE: ZTCODE;
  SiteAssessmentStatus: SiteAssessmentStatus;
  SupplierReplyStatus: SupplierReplyStatus;
  HistoryPurchase: HistoryPurchase;
  SupplierUpgradeStatus: SupplierUpgradeStatus;
  RoleType: RoleType;
  RequestUpdateStatusSupplier: RequestUpdateStatusSupplier;
  RequestUpdateStatusSupplierService: RequestUpdateStatusSupplier;
  PurchasingSource: PurchasingSource;
  TemplateSupplierType: TemplateSupplierType;
  SupplierType: SupplierType2;
  RatingType: RatingType;
  AuctionType: AuctionType;
  AuctionOutsideType: AuctionOutsideType;
  QuickPriceType: QuickPriceType;
  LockType: LockType;
  REFERENCE_SOURCE: REFERENCESOURCE;
  ContractInspectionStatus: ContractInspectionStatus;
  ReferenceSourcePo: ReferenceSourcePo;
  PrItemClosed: PrItemClosed;
  CompanyLevel: CompanyLevel;
  BillStatus: BillStatus;
  BillStatusSupplier: BillStatusSupplier;
  BillPaymentStatus: BillPaymentStatus;
  Platform: Platform;
  ContractAppendixStatus: ContractAppendixStatus;
  ProposeBudgetType: ProposeBudgetType;
  ReceiptBudgetType: ReceiptBudgetType;
  BaseAdjust: BaseAdjust;
  contractInspectionType: ContractInspectionType;
  BidType: BidType;
  ComplaintType: ComplaintType;
  ComplaintTypeCompanyGroup: ComplaintTypeCompanyGroup;
  ComplaintTemplateStatus: ComplaintTemplateStatus;
  ComplaintInspectionLotStatus: ComplaintInspectionLotStatus;
  ReferenceComplaintType: ReferenceComplaintType;
  CodingComplaint: CodingComplaint;
  ChoiceComplaintKTQM: ChoiceComplaintKTQM;
  ChoiceComplaintMeasure: ChoiceComplaintMeasure;
  ChoiceComplaintQM: ChoiceComplaintQM;
  ChoiceComplaintVW1: ChoiceComplaintVW1;
  ChoiceComplaintVW2: ChoiceComplaintVW1;
  ChoiceComplaintVW3: ChoiceComplaintVW3;
  ChoiceComplaintVW4: ChoiceComplaintVW4;
  ChoiceComplaintYESNO: ChoiceComplaintYESNO;
  ComplaintStatus: ComplaintStatus;
  ComplaintAggregationStatus: ComplaintAggregationStatus;
  CodeGroup: CodeGroup;
  TaskGroup: TaskGroup;
  ActivityCode: ActivityCode;
  ActivityGroup: ActivityGroup;
  referencesInvoice: ReferencesInvoice;
  SettingString: SettingString;
  SettingStringTypeDynamic: SettingStringTypeDynamic;
  OrderType: OrderType;
  PriceListType: PriceListType;
  PaymentStatus: PaymentStatus;
  OrganizationalType: OrganizationalType;
  OrganizationalTakeType: OrganizationalTakeType;
  RoundUpContCol: RoundUpContCol;
  TimeType: TimeType;
  DataMapping: DataMapping;
  RoundUpContTemplateStatus: RoundUpContTemplateStatus;
  InternalTemplateStatus: InternalTemplateStatus;
  ShipmentConfigTemplate: ShipmentConfigTemplate;
  RoundUpContTemplateType: RoundUpContTemplateType;
  RoundUpContStatus: RoundUpContStatus;
  BusinessPlanTemplateStatus: RoundUpContTemplateStatus;
  BusinessPlanCol: BusinessPlanCol;
  dataTypeDeclaration: DataTypeDeclaration;
  BusinessPlanStatus: BusinessPlanStatus;
  PurchaseKpi: PurchaseKpi;
  KpiStatus: KpiStatus;
  SRCTYPE: SRCTYPE;
  TypeOf: TypeOf;
  RoleTake: RoleTake;
  RoleData: RoleData;
  TicketEvaluationKpiStatus: TicketEvaluationKpiStatus;
  Month: Month;
  Quarter: Quarter;
  Year: Year;
  RoleSupplierNumber: RoleSupplierNumber;
  RoleEnum: RoleEnum;
  SupplierNumberSettingRolePermission: SupplierNumberSettingRolePermission;
  BankGroupType: BankGroupType;
  SupplierPotentialUpgradeStatus: SupplierPotentialUpgradeStatus;
  ReferenceSource: ReferenceSource;
  paymentType: PaymentType;
  supplierSource: SupplierSource;
  PlanSiteAssessmentStatus: PlanSiteAssessmentStatus;
  FlowAppoveType: FlowAppoveType;
  BusinessTransaction: BusinessTransaction;
  RequestUpdateSupplierType: SupplierExpertiseDetailType;
  Reservation: Reservation;
  ReservationTime: ReservationTime;
  ShipmentPlanNumberType: ShipmentPlanNumberType;
  ShipmentPriceStatus: ShipmentPriceStatus;
  ShipmentPlanStatus: ShipmentPlanStatus;
  ReservationStatus: ReservationStatus;
  ReservationType: ReservationType;
  MessageType: MessageType;
  CriteriaType: CriteriaType;
  BizType: BizType;
  DataTypeSiteAssessment: DataTypeSiteAssessment;
  LegalEntity: LegalEntity;
  MappingField: MappingField;
  Acccate: Acccate;
  ItemCategory: ItemCategory;
  OutputField: OutputField;
  PRTypeCont: PRTypeCont;
  LeadTime: LeadTime;
  PurchasePlanType: PurchasePlanType;
  PurposeQuote: PurposeQuote;
  TypeQuote: TypeQuote;
  QuotationPeriod: QuotationPeriod;
  ReferenceQuote: ReferenceQuote;
  QuotationForm: QuotationForm;
  RequestStatus: RequestStatus;
  SupplierRequestStatus: SupplierRequestStatus;
  OptionYesNo: OptionYesNo;
  OptionYesNoEn: OptionYesNo;
  FreightPaymentTerm: FreightPaymentTerm;
  FreightPaymentTermEn: FreightPaymentTerm;
  ContractReferenceFrom: ContractReferenceFrom;
  ContractType: ContractType;
  IncotermVersion: IncotermVersion;
  BusinessTemplatePlanStatus: BusinessTemplatePlanStatus;
  PurchasingPlanStatus: PurchasingPlanStatus;
  BusinessTemplatePlanRef: BusinessTemplatePlanRef;
  CostType: CostType;
  AccountAssignment: Acccate;
  OptionShipmentOfBusinessPlan: OptionShipmentOfBusinessPlan;
  CostConfigType: CostConfigType;
  BusinessTemplatePlanCostType: BusinessTemplatePlanCostType;
  Template: Template;
  ShipmentCostStreamStatus: InternalTemplateStatus;
  BidStatusNew: BidStatusNew;
  TaxCodeStatus: TaxCodeStatus;
  SalesOrgStatus: SalesOrgStatus;
  DistributionChannelStatus: SalesOrgStatus;
  TaxClassificationMaterialGroupStatus: SalesOrgStatus;
  DealStatus: DealStatus;
  ItemCategoryGroupStatus: SalesOrgStatus;
  AccountAssignmentGroupStatus: SalesOrgStatus;
  SupplierDealStatus: SupplierDealStatus;
  DealType: TypeOf;
  BrandMaterialGroupStatus: SalesOrgStatus;
  HeadBrandMaterialGroupStatus: SalesOrgStatus;
  RoleSettingMaterial: RoleSettingMaterial;
  PaymentBlock: Employee[];
  PaymentMethod: PaymentMethod;
  PaymentType: PaymentType2;
  TaxType: TaxType;
  OriginGroupStatus: SalesOrgStatus;
  ValuationClassStatus: SalesOrgStatus;
  PlantStorageStatus: SalesOrgStatus;
  ProfitCenterStatus: ProfitCenterStatus;
  SettingRolePermission: SettingRolePermission;
  ExclusiveString: ExclusiveString;
  MaterialStatus: MaterialStatus;
  BidFile: BidFile;
  BidEmployee: BidEmployee;
  BiddingPurposes: BiddingPurposes;
  BiddingType: BiddingType;
  FormContract: FormContract;
  BidReference: BidReference;
  FilterStatus: FilterStatus;
  ServiceStatus: ServiceStatus;
  BidRateStatus: BidRateStatus;
  AdjustMaterialForm: AdjustMaterialForm;
  AdjustMaterialFormStatus: AdjustMaterialFormStatus;
  AdjustMaterialFormType: AdjustMaterialFormType;
  MaterialBulkUpdateRelatedField: MaterialBulkUpdateRelatedField;
  InboundItemLeadTimeStatus: InboundItemLeadTimeStatus;
  InboundPOStatus: InboundPOStatus;
  MaterialLockInfoFormType: MaterialLockInfoFormType;
  MaterialLockInfoFormStatus: MaterialLockInfoFormStatus;
  TAX_CODE: TAXCODE;
  ShipmentCondition: ShippingCondition;
  IdType: IdType;
  IdNumber: IdNumber;
  PurchaseOrderType: PurchaseOrderType;
  Industry: Industry;
  IndustrySystem: IndustrySystem;
  AccountType: Employee[];
  uomStatus: UomStatus;
  leadtimeStatus: UomStatus;
  MatGroup4Status: MatGroup4Status;
  FieldStatusGroup: FieldStatusGroup;
  ReconAccountForAcctType: ReconAccountForAcctType;
  POType: POType;
  POFunction: POFunction;
  PoPartnerType: PoPartnerType;
  CheckInventory: CheckInventory;
  PriceControlIndicator: PriceControlIndicator;
  PriceDetermination: PriceDetermination;
  StepPicking: PriceDetermination;
  Backflush: Backflush;
  VarOun: VarOun;
  PeriodIndLED: PeriodIndLED;
  RequirementPlanningType: RequirementPlanningType;
  LotSizeProcedure: LotSizeProcedure;
  BusinessPartner: BusinessPartner;
  SupplierNplPriceUnit: SupplierNplPriceUnit;
  CalculationType: CalculationType;
  ScaleBaseType: ScaleBaseType;
  ConditionClass: ConditionClass;
  CalculationBase: ScaleBaseType;
  BillMapStatus: BillMapStatus;
  ShipmentFeeCondition: ShipmentFeeCondition;
  ImportExportType: ImportExportType;
  TaxCodeType: TaxCodeType;
  RecommendedShipmentStatus: RecommendedShipmentStatus;
  actionType: ActionType;
  StatusSap: StatusSap;
  typePAKD: TypePAKD;
  IndicatorItem: IndicatorItem;
  PRPeriodStatus: PRPeriodStatus;
  MaterialBlock: MaterialBlock;
  GroupCompanies: GroupCompanies;
  PriceQuoteItemTemplateStatus: InternalTemplateStatus;
  ProductStandards: ProductStandards;
  ConfigureQuotationFormat: ConfigureQuotationFormat;
  MiroReversalType: MiroReversalType;
  BudgetType: BudgetType;
}

interface BudgetType {
  BI41: BI41;
  BI42: BI41;
  BI43: BI41;
  BI44: BI41;
  BI45: BI41;
  BI46: BI41;
  BI47: BI41;
  BI48: BI41;
  BI49: BI41;
  BI10: BI41;
  BI11: BI41;
  BI12: BI41;
}

interface BI41 {
  code: string;
  months: string[];
}

interface MiroReversalType {
  "01": Employee;
  "02": Employee;
  "03": Employee;
  "04": Employee;
  "05": Employee;
}

interface ConfigureQuotationFormat {
  CONG_KHAI: ChuaTao;
  CO_DIEU_KIEN: ChuaTao;
  CHI_DINH: ChuaTao;
}

interface ProductStandards {
  CO_TINH: Employee;
  HOA_TINH: Employee;
  NGOAI_QUAN: Employee;
  TIEU_CHUAN_KHAC: Employee;
  PHUONG_PHAP_THU: Employee;
}

interface GroupCompanies {
  WOOD: Employee;
  MATERIAL: Employee;
  GX_MB: Employee;
  DECOR: Employee;
}

interface MaterialBlock {
  General: string;
  Sales: string;
  Purchasing: string;
  Mrp: string;
  QM: string;
  Accounting: string;
  Costing: string;
  CoProduct: string;
  Wms: string;
  ApprovalSyncSap: string;
}

interface PRPeriodStatus {
  N: DaTuChoi;
  C: DaTuChoi;
  A: DaTuChoi;
  C_A: DaTuChoi;
  R: DaTuChoi;
}

interface IndicatorItem {
  S: Employee;
  H: Employee;
}

interface TypePAKD {
  P001: Employee;
  P101: Employee;
  P210: Employee;
  Intermediary: Employee;
  P510: Employee;
  P610: Employee;
  P701: Employee;
}

interface StatusSap {
  APPROVED: AwaitingConfirmation;
  ERROR: AwaitingConfirmation;
}

interface ActionType {
  CREATE: Employee;
  EDIT: Employee;
  DELETE: Employee;
}

interface RecommendedShipmentStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  APPROVE: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  CHECK_AGAIN: AwaitingConfirmation;
}

interface TaxCodeType {
  HH: Employee;
  BILL: Employee;
}

interface ImportExportType {
  XK: Employee;
  NK: Employee;
}

interface ShipmentFeeCondition {
  POD: Employee;
  POL: Employee;
  HUTYPE: Employee;
  SHIPPINGLINE: Employee;
  SHIPTO: Employee;
  DELIVERYPLACE: Employee;
  ITEM: Employee;
  SHIPMENT: Employee;
}

interface BillMapStatus {
  NEW: AwaitingConfirmation;
  DONE: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
}

interface ConditionClass {
  A: Employee;
  B: Employee;
  C: Employee;
  D: Employee;
  E: Employee;
  F: Employee;
  G: Employee;
  H: Employee;
  P: Employee;
  Q: Employee;
  W: Employee;
}

interface ScaleBaseType {
  A: Employee;
  B: Employee;
  C: Employee;
  D: Employee;
  E: Employee;
  F: Employee;
  O: Employee;
  P: Employee;
}

interface CalculationType {
  A: Employee;
  B: Employee;
  C: Employee;
  D: Employee;
  E: Employee;
  F: Employee;
  G: Employee;
  H: Employee;
  I: Employee;
  J: Employee;
  K: Employee;
  L: Employee;
  M: Employee;
  N: Employee;
  O: Employee;
  P: Employee;
  Q: Employee;
  R: Employee;
  S: Employee;
  T: Employee;
  U: Employee;
  V: Employee;
  W: Employee;
}

interface SupplierNplPriceUnit {
  M3: Employee;
  CONT_20: Employee;
  CONT_40: Employee;
  TON: Employee;
  TRIP: Employee;
  PAIR: Employee;
}

interface BusinessPartner {
  Z01: number[];
  Z02: number[];
  Z03: number[];
  Z05: number[];
  Z06: number[];
  Z07: number[];
  Z08: number[];
  Z88: number[];
  Z09: number[];
  Z91: number[];
  Z94: number[];
}

interface LotSizeProcedure {
  EX: Employee;
  FX: Employee;
  H1: Employee;
  HB: Employee;
  M2: Employee;
  MB: Employee;
  PB: Employee;
  PK: Employee;
  TB: Employee;
  W2: Employee;
  WB: Employee;
}

interface RequirementPlanningType {
  "0": Employee;
  "1": Employee;
  "2": Employee;
}

interface PeriodIndLED {
  D: Employee;
  M: Employee;
  W: Employee;
  Y: Employee;
}

interface VarOun {
  NotActive: Employee;
  Active: Employee;
  ActiveWithWwnPrice: Employee;
}

interface Backflush {
  "1": Employee;
  "2": Employee;
}

interface PriceDetermination {
  "2": Employee;
  "3": Employee;
}

interface PriceControlIndicator {
  S: Employee;
  V: Employee;
}

interface CheckInventory {
  "01": Employee;
  "02": Employee;
  CH: Employee;
  DR: Employee;
  KP: Employee;
}

interface PoPartnerType {
  EMPLOYEE: Employee;
  SUPPLIER: Employee;
}

interface POFunction {
  VN: Employee;
  PI: Employee;
  GS: Employee;
  Z1: Employee;
  Z2: Employee;
  Z8: Employee;
  Z9: Employee;
}

interface POType {
  ZPO1: Employee;
  ZPO2: Employee;
  ZPO3: Employee;
  ZPO4: Employee;
  ZPO5: Employee;
  ZPO6: Employee;
  ZPO7: Employee;
  ZPO8: Employee;
  ZPO9: Employee;
  ZP11: Employee;
  ZP13: Employee;
  ZP14: Employee;
  ZP15: Employee;
  ZP16: Employee;
  ZP17: Employee;
  ZP18: Employee;
  ZP19: Employee;
  ZP20: Employee;
  ZP21: Employee;
}

interface ReconAccountForAcctType {
  A: Employee;
  K: Employee;
  D: Employee;
  blank: Employee;
}

interface FieldStatusGroup {
  T01: Employee;
  T02: Employee;
  T03: Employee;
  T04: Employee;
  T05: Employee;
  T06: Employee;
  T07: Employee;
}

interface MatGroup4Status {
  NEW: AwaitingConfirmation;
  CANCELED: AwaitingConfirmation;
}

interface UomStatus {
  NEW: AwaitingConfirmation;
  ACTIVE: AwaitingConfirmation;
  CANCELED: AwaitingConfirmation;
}

interface IndustrySystem {
  "1": Employee;
  "2": Employee;
  "3": Employee;
  "10": Employee;
  "11": Employee;
  "12": Employee;
  "13": Employee;
  "21": Employee;
  "22": Employee;
  "23": Employee;
  "24": Employee;
  "25": Employee;
  "26": Employee;
  "27": Employee;
  "31": Employee;
  "32": Employee;
  "41": Employee;
  "42": Employee;
  "43": Employee;
  "44": Employee;
  "45": Employee;
  "46": Employee;
  "47": Employee;
  "51": Employee;
  "52": Employee;
  "61": Employee;
  "62": Employee;
  "63": Employee;
  "64": Employee;
  "71": Employee;
  "72": Employee;
  "73": Employee;
  "81": Employee;
  "82": Employee;
  "83": Employee;
  "84": Employee;
  "85": Employee;
  "86": Employee;
  "91": Employee;
  "92": Employee;
  "93": Employee;
  "94": Employee;
  "99": Employee;
}

interface Industry {
  Z1100: Employee;
  Z1102: Employee;
  Z1103: Employee;
  Z1104: Employee;
  Z1220: Employee;
  Z1221: Employee;
  Z1300: Employee;
  Z1301: Employee;
  Z1600: Employee;
  Z1601: Employee;
  Z1602: Employee;
  Z1603: Employee;
  Z1700: Employee;
  Z2000: Employee;
  Z2001: Employee;
  Z2002: Employee;
  Z2200: Employee;
  Z2300: Employee;
  Z2500: Employee;
  Z2800: Employee;
  Z2801: Employee;
  Z2802: Employee;
  Z2803: Employee;
  Z2804: Employee;
  Z2805: Employee;
  Z2806: Employee;
  Z2807: Employee;
  Z2808: Employee;
  Z2809: Employee;
  Z2810: Employee;
  Z2811: Employee;
  Z2812: Employee;
  Z2813: Employee;
  Z2814: Employee;
  Z2815: Employee;
  Z2816: Employee;
  Z2817: Employee;
  Z2818: Employee;
  Z2900: Employee;
  Z2901: Employee;
  Z2902: Employee;
  Z2903: Employee;
  Z3100: Employee;
  Z3101: Employee;
  Z3102: Employee;
  Z3200: Employee;
  Z9999: Employee;
}

interface PurchaseOrderType {
  RECOMMENDED_PURCHASE: Employee;
  CONTRACT: Employee;
  PR: Employee;
  RESERVATION: Employee;
  NONE: Employee;
}

interface IdNumber {
  Z00001: Employee;
  Z00002: Employee;
  Z00003: Employee;
  Z00004: Employee;
  Z00005: Employee;
  Z00006: Employee;
  Z00007: Employee;
  Z00008: Employee;
  Z00009: Employee;
  Z00010: Employee;
  Z00011: Employee;
}

interface IdType {
  VN1: Employee;
  VN2: Employee;
  VN3: Employee;
  VN4: Employee;
  VN5: Employee;
}

interface TAXCODE {
  ACTIVE: Employee;
  UNACTIVE: Employee;
}

interface MaterialLockInfoFormStatus {
  NEW: DongThau;
  WAITING_APPROVED: DongThau;
  APPROVED: DongThau;
  CANCEL: DongThau;
}

interface MaterialLockInfoFormType {
  ALL: Employee;
  PARTS: Employee;
}

interface InboundPOStatus {
  NOT_UP: AwaitingConfirmation;
  UP_A_PART: AwaitingConfirmation;
  ENOUGH: AwaitingConfirmation;
}

interface InboundItemLeadTimeStatus {
  NEW: Employee;
  IN_PROGRESS: Employee;
  DONE: Employee;
  COMPLETE: Employee;
}

interface MaterialBulkUpdateRelatedField {
  MATERIAL_SELL: Employee;
  MATERIAL_ACCOUNTING: Employee;
  MATERIAL_WAREHOUSE: Employee;
  MATERIAL_STORAGE_LOCATION: Employee;
  UOM: Employee;
  CO_PRODUCT: Employee;
  CO_PRODUCT_CHILD: Employee;
}

interface AdjustMaterialFormType {
  GENERAL: Employee;
  OTHER: Employee;
}

interface AdjustMaterialFormStatus {
  NEW: DongThau;
  WAITING_APPROVED: DongThau;
  APPROVED: DongThau;
  APPROVED_PARTIAL: DongThau;
  CANCEL: DongThau;
}

interface AdjustMaterialForm {
  NEW: Employee;
  WAITING_APPROVED: Employee;
  APPROVED: Employee;
  CANCEL: Employee;
}

interface BidRateStatus {
  DaDanhGia: Employee;
  ChuaDanhGia: Employee;
}

interface ServiceStatus {
  ACTIVED: Employee;
  APPROVED: Employee;
  WAITING_APPROVED: Employee;
  IS_EVALUATING: Employee;
  NOT_APPROVED: Employee;
  IS_LOCKED: Employee;
  IS_APPROVING: Employee;
}

interface FilterStatus {
  NEAR: Employee;
}

interface BidReference {
  PR: Employee;
  PR_TOTAL: Employee;
  NCSD: Employee;
  NCSD_TOTAL: Employee;
  PAVC: Employee;
  NO: Employee;
  NO_ITEM: Employee;
}

interface FormContract {
  O: Employee;
  C: Employee;
  P: Employee;
  T: Employee;
}

interface BiddingType {
  O: Employee;
  C: Employee;
  A: Employee;
}

interface BiddingPurposes {
  NVL: Employee;
  ORDER: Employee;
  ASSET: Employee;
  TRANSPORT: Employee;
}

interface BidEmployee {
  Tech: ChuaTao;
  TechMember: ChuaTao;
  Trade: ChuaTao;
  TradeMember: ChuaTao;
  Memmber: ChuaTao;
  MemmberAll: ChuaTao;
}

interface BidFile {
  BidFile: Employee;
  BidFileOther: Employee;
}

interface MaterialStatus {
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  INPUTTING: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  RECHECK: AwaitingConfirmation;
  ACTIVE: AwaitingConfirmation;
  LOCKED: AwaitingConfirmation;
}

interface ExclusiveString {
  company: Company;
  purchasingOrg: Company;
  purchasingGroup: Company;
  plant: Company;
  type: Company;
}

interface Company {
  code: string;
  lstExclusiveString: string[];
}

interface SettingRolePermission {
  SupplierNumber: Employee;
  Material: Employee;
}

interface ProfitCenterStatus {
  NEW: DongThau;
  CANCEL: DongThau;
}

interface TaxType {
  COMMON: Employee;
  SEPARATE: Employee;
}

interface PaymentType2 {
  N: Employee;
  A: Employee;
  ALLOCATED: Employee;
  NON_ALLOCATED: Employee;
}

interface PaymentMethod {
  Cash: Employee;
  Transfer: Employee;
}

interface RoleSettingMaterial {
  GeneralDataWrite: Employee;
  GeneralDataEdit: Employee;
  SalesDataWrite: Employee;
  SalesDataEdit: Employee;
  PurchasingDataWrite: Employee;
  PurchasingDataEdit: Employee;
  MrpWorksSchedulingDataWrite: Employee;
  MrpWorksSchedulingDataEdit: Employee;
  QualityDataWrite: Employee;
  QualityDataEdit: Employee;
  AccountingCostingDataWrite: Employee;
  AccountingCostingDataEdit: Employee;
}

interface SupplierDealStatus {
  A: AwaitingConfirmation;
  C: AwaitingConfirmation;
  S: AwaitingConfirmation;
}

interface DealStatus {
  P: AwaitingConfirmation;
  C: AwaitingConfirmation;
}

interface SalesOrgStatus {
  NEW: DongThau;
  IN_PROGRESS: DongThau;
  APPROVED: DongThau;
  CANCEL: DongThau;
}

interface TaxCodeStatus {
  Active: AwaitingConfirmation;
  UnActive: AwaitingConfirmation;
}

interface BidStatusNew {
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  A: AwaitingConfirmation;
  P: AwaitingConfirmation;
  R: DaTuChoi;
  C: DaTuChoi;
}

interface Template {
  TemplateContract: Employee;
  TempTemplateContract: Employee;
  ContractAppendix: Employee;
  TemplateContractInspection: Employee;
  TemplatePO: Employee;
}

interface BusinessTemplatePlanCostType {
  Master: Q1;
  Hand: Q1;
  Raw: Q1;
  Overview: Q1;
}

interface CostConfigType {
  Overview: Employee;
  Detail: Employee;
}

interface OptionShipmentOfBusinessPlan {
  Hand: Hand;
  Shipment: Hand;
}

interface Hand {
  code: string;
  value: string;
}

interface CostType {
  MasterData: Employee;
  Input: Employee;
  Vanilla: Employee;
  Overview: Employee;
}

interface BusinessTemplatePlanRef {
  PAVC: Employee;
  Input: Employee;
}

interface PurchasingPlanStatus {
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  A: AwaitingConfirmation;
  R: DaTuChoi;
  C_PR: DaTuChoi;
}

interface BusinessTemplatePlanStatus {
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  A: AwaitingConfirmation;
  R: DaTuChoi;
  C_PR: DaTuChoi;
  RE_CHECK: AwaitingConfirmation;
}

interface IncotermVersion {
  IncotermVersion2000: Employee;
  IncotermVersion2010: Employee;
  IncotermVersion2020: Employee;
}

interface ContractType {
  MK: Employee;
  NT: Employee;
  WK: Employee;
  ZGC1: Employee;
  ZMB1: Employee;
  ZMB2: Employee;
  ZMB3: Employee;
  ZMB4: Employee;
  ZNT1: Employee;
  ZNT2: Employee;
  ZNT3: Employee;
  ZNT4: Employee;
  ZVC1: Employee;
}

interface ContractReferenceFrom {
  Normal: Employee;
  FrameWork: Employee;
}

interface FreightPaymentTerm {
  Prepaid: Employee;
  Collect: Employee;
}

interface OptionYesNo {
  Allowed: Employee;
  NotAllowed: Employee;
}

interface SupplierRequestStatus {
  XacNhan: NgungHoatDong;
  TuChoi: NgungHoatDong;
  ChoXacNhan: NgungHoatDong;
}

interface RequestStatus {
  T: AwaitingConfirmation;
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  C: AwaitingConfirmation;
  A: AwaitingConfirmation;
  R: DaTuChoi;
  C_L: DaTuChoi;
}

interface QuotationForm {
  PUBLIC: Employee;
  NCC: Employee;
}

interface ReferenceQuote {
  PR: Employee;
  PR_TOTAL: Employee;
  PAVC: Employee;
  NO: Employee;
  CPVC: Employee;
}

interface QuotationPeriod {
  DAY: Employee;
  WEEK: Employee;
  MONTH: Employee;
  YEAR: Employee;
}

interface TypeQuote {
  UNEXPECTED: Employee;
  PERIODIC: Employee;
}

interface PurposeQuote {
  NVL: Employee;
  ND: Employee;
  ORDER: Employee;
  ASSET: Employee;
  TRANSPORT: Employee;
  TRANSPORT_ND: Employee;
  BH: Employee;
}

interface PurchasePlanType {
  NEW: Employee;
  INTERNATIONAL: Employee;
}

interface LeadTime {
  DNHM: Employee;
  HD: Employee;
  TGNCCCBNL: Employee;
  NCCSX: Employee;
  TGNCCSX: Employee;
  TGVCNCCDENC: Employee;
  TGTUCANGTOIKHOKT: Employee;
  KTCLNK: Employee;
  TLTMH: Employee;
  TLTKH: Employee;
}

interface PRTypeCont {
  SUMMARY: Employee;
  NORMAL: Employee;
}

interface OutputField {
  prItemId: Employee;
  roundedContQtyDC: Employee;
  supplierReturnQty: Employee;
  stockQuantity: Employee;
  safetyStock: Employee;
  demandQtyN: Employee;
  demandQtyN1: Employee;
  demandQtyN2: Employee;
}

interface ItemCategory {
  K: ChuaTao;
  L: ChuaTao;
  S: ChuaTao;
  U: ChuaTao;
  D: ChuaTao;
  E: ChuaTao;
  C: ChuaTao;
  P: ChuaTao;
}

interface Acccate {
  A: ChuaTao;
  B: ChuaTao;
  C: ChuaTao;
  D: ChuaTao;
  E: ChuaTao;
  F: ChuaTao;
  G: ChuaTao;
  K: ChuaTao;
  M: ChuaTao;
  N: ChuaTao;
  P: ChuaTao;
  Q: ChuaTao;
  T: ChuaTao;
  U: ChuaTao;
  X: ChuaTao;
  Z: ChuaTao;
}

interface MappingField {
  prItemId: Employee;
  productCode: Employee;
  productName: Employee;
  unitCode: Employee;
  safetyStock: Employee;
  stockQuantity: Employee;
  demandQtyN: Employee;
  prAndPoOpenQtyN: Employee;
  demandQtyN1: Employee;
  prAndPoOpenQtyN1: Employee;
  closingStockN1: Employee;
  demandQtyN2: Employee;
  prAndPoOpenQtyN2: Employee;
  quantity: Employee;
  demandQtyN3: Employee;
  prAndPoOpenQtyN3: Employee;
  unitsPerCarton: Employee;
  cartonCount: Employee;
  length: Employee;
  width: Employee;
  height: Employee;
  cbmPerSku: Employee;
  deliveryDate: Employee;
}

interface LegalEntity {
  HO: Employee;
  SITE: Employee;
}

interface DataTypeSiteAssessment {
  STRING: Employee;
  NUMBER: Employee;
  LIST: Employee;
  FILE: Employee;
}

interface BizType {
  MANUFACTURING: Employee;
  TRADING: Employee;
  SERVICE: Employee;
  OTHER: Employee;
}

interface CriteriaType {
  LAW: Employee;
  CAPACITY: Employee;
}

interface MessageType {
  ERROR: Employee;
  SUCCESS: Employee;
}

interface ReservationType {
  HangHoa: Employee;
  DichVu: Employee;
  TongHop: Employee;
}

interface ReservationStatus {
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  C: AwaitingConfirmation;
  A: AwaitingConfirmation;
  R: DaTuChoi;
  C_PR: DaTuChoi;
}

interface ShipmentPlanStatus {
  NEW: DongThau;
  IN_PROGRESS: DongThau;
  APPROVED: DongThau;
  CANCEL: DongThau;
  REVERT: Employee;
}

interface ShipmentPriceStatus {
  NEW: Employee;
  IN_PROGRESS: Employee;
  APPROVED: Employee;
  CANCEL: Employee;
  REVERT: Employee;
}

interface ShipmentPlanNumberType {
  Shipment: Employee;
  Manual: Employee;
}

interface ReservationTime {
  MONTH: Employee;
  QUARTERLY: Employee;
  YEAR: Employee;
}

interface Reservation {
  IT: Employee;
  VPP: Employee;
  OTHER: Employee;
}

interface BusinessTransaction {
  PR: PR;
  DNMH: PR;
  PO: PR;
}

interface PR {
  code: string;
}

interface FlowAppoveType {
  None: AwaitingConfirmation;
  LackOfFunds: AwaitingConfirmation;
}

interface PlanSiteAssessmentStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  REQUEST_RE_CHECK: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  DOING: AwaitingConfirmation;
  COMPLETE: AwaitingConfirmation;
}

interface SupplierSource {
  PORTAL: Employee;
  ADMIN: Employee;
}

interface PaymentType {
  N: Employee;
  A: Employee;
}

interface ReferenceSource {
  BusinessPlan: Employee;
}

interface SupplierPotentialUpgradeStatus {
  New: AwaitingConfirmation;
  SentSupplier: AwaitingConfirmation;
  SupplierRespond: AwaitingConfirmation;
  ReCheck: AwaitingConfirmation;
  WaitSapCode: AwaitingConfirmation;
  WaitApprove: AwaitingConfirmation;
  Approved: AwaitingConfirmation;
  NoResponse: AwaitingConfirmation;
}

interface BankGroupType {
  VIETTINBANK: Employee;
  REMAINING_BANKS: Employee;
}

interface SupplierNumberSettingRolePermission {
  Supplier: Supplier;
  BusinessPartner: Supplier;
  FISupplier: Supplier;
}

interface Supplier {
  code: string;
  name: string;
  View: Employee;
  Write: Employee;
  Edit: Employee;
}

interface RoleEnum {
  Country: Country;
  Region: Country;
  ServiceTemplate: Country;
  SupplierTemplate: Country;
  RoundUpContTemplate: Country;
  BusinessPlanTemplate: Country;
  PriceList: Country;
  PurchaseKpi: Country;
  Procedure: Country;
  ConditionTypeMaster: Country;
  SupplierSchema: Country;
  PurchasingOrgSchema: Country;
  Schema: Country;
  Company: Country;
  Plant: Country;
  Block: Country;
  Department: Country;
  Part: Country;
  Position: Country;
  PurchasingOrg: Country;
  PurchasingGroup: Country;
  Currency: Country;
  Incoterm: Country;
  PaymentTerm: Country;
  PaymentMethod: Country;
  PlanningGroup: Country;
  ShareholderCategory: Country;
  CostCenter: Country;
  BusinessPartnerGroupr: Country;
  Employee: Country;
  BusinessType: Country;
  BillLookup: Country;
  PermissionAdditional: Country;
  FlowApprove: Country;
  Uom: Country;
  MaterialType: Country;
  ExternalMaterialGroup: Country;
  MatGroup: Country;
  Material: Country;
  Service: Country;
  Asset: Country;
  ShipmentRoute: Country;
  Points: Country;
  ShipmentCostType: Country;
  Bank: Country;
  BankBranch: Country;
  GlAccount: Country;
  Order: Country;
  MasterBidForm: Country;
  MasterBidGuaranteeForm: Country;
  EmailTemplate: Country;
  FaqCategory: Country;
  Faq: Country;
  LanguageKey: Country;
  CompanyAddress: Country;
  SettingString: Country;
  ManagementSupSupplier: Country;
  SupplierCapacity: Country;
  SupplierNumberSettingRole: Country;
  SupplierCreateCode: Country;
  ApproveRequestUpdateLawSupplier: Country;
  ApproveRequestUpdateCapacitySupplier: Country;
  ApproveRequestActiveSupplierService: Country;
  ApproveRequestActiveSupplier: Country;
  SupplierUpgrade: Country;
  SiteAssessment: Country;
  EvaluationHistoryPurchase: Country;
  BidNew: Country;
  BidRate: Country;
  BidInfo: Country;
  BidNewSurvey: Country;
  PriceQuoteList: Country;
  Auction: Country;
  BusinessPlan: Country;
  RoundUpCont: Country;
  Contract: Country;
  ContractAppendix: Country;
  PO: Country;
  Inbound: Country;
  ShipmentSchedule: Country;
  Bill: Country;
  Payment: Country;
  Complaint: Country;
  Shipment: Country;
  ShipmentCost: Country;
  Budget: Country;
  TicketEvaluationKpi: Country;
  PurchaseRequestList: Country;
  PlanSiteAssessment: Country;
}

interface Country {
  name: string;
  path: string;
  code: string;
}

interface RoleSupplierNumber {
  BusinessPartnerWrite: Employee;
  BusinessPartnerEdit: Employee;
  SupplierWrite: Employee;
  SupplierEdit: Employee;
  FISupplierWrite: Employee;
  FISupplierEdit: Employee;
  SendApproval: Employee;
}

interface Year {
  LAST_YEAR: Employee;
  SPECIFIC_DATE: Employee;
}

interface Quarter {
  LAST_QUARTER: Employee;
  SPECIFIC_DATE: Employee;
}

interface Month {
  LAST_MONTH: Employee;
  SPECIFIC_DATE: Employee;
}

interface TicketEvaluationKpiStatus {
  NEW: AwaitingConfirmation;
  EVALUATING: AwaitingConfirmation;
  REVIEWED: AwaitingConfirmation;
  WAIT_CONFIRMATION: AwaitingConfirmation;
  CHECK_AGAIN: AwaitingConfirmation;
  COMPLETED: AwaitingConfirmation;
}

interface RoleData {
  Person: Employee;
  Child: Employee;
  AllCompany: Employee;
  All: Employee;
}

interface RoleTake {
  USER: Employee;
  EMPLOYEE: Employee;
}

interface TypeOf {
  CURRENCY: Employee;
  PERCENT: Employee;
}

interface SRCTYPE {
  SYSTEM: Employee;
  MANUAL: Employee;
}

interface KpiStatus {
  NOT_DECENTRALIZATION: AwaitingConfirmation;
  DECENTRALIZATION: AwaitingConfirmation;
}

interface PurchaseKpi {
  MONTH: Employee;
  PRECIOUS: Employee;
  YEAR: Employee;
}

interface BusinessPlanStatus {
  Draft: WAITEPAY;
  New: WAITEPAY;
  Wait: WAITEPAY;
  Approved: WAITEPAY;
  Cancel: WAITEPAY;
  CheckAgain: WAITEPAY;
}

interface DataTypeDeclaration {
  DeliveryItem: Employee;
  HUGroup: Employee;
  ShipmentCostItem: Employee;
}

interface BusinessPlanCol {
  QuantityInStock: Q1;
  QuantityInRoad: Q1;
  UnitPricePurchases: Q1;
  ValueGoodInRoad: Q1;
  UnitPurchasePrice: Q1;
  QuantityArrived: Q1;
  UnitPriceQuote: Q1;
  BiddingPackagePrice: Q1;
  ExchangeValue: Q1;
}

interface RoundUpContStatus {
  Draft: WAITEPAY;
  New: WAITEPAY;
  Cancel: WAITEPAY;
  Doing: WAITEPAY;
  Complete: WAITEPAY;
}

interface RoundUpContTemplateType {
  KG: Employee;
  CBM: Employee;
}

interface ShipmentConfigTemplate {
  New: WAITEPAY;
  Active: WAITEPAY;
  Cancel: WAITEPAY;
}

interface InternalTemplateStatus {
  Active: WAITEPAY;
  UnActive: WAITEPAY;
}

interface RoundUpContTemplateStatus {
  New: WAITEPAY;
  Active: WAITEPAY;
  UnActive: WAITEPAY;
}

interface DataMapping {
  Database: Employee;
  DynamicSetup: Employee;
}

interface TimeType {
  Min: Min;
  Hours: Min;
  Day: Min;
  Month: Min;
  Year: Min;
}

interface Min {
  code: string;
  name: string;
  suffix: string;
}

interface RoundUpContCol {
  SafeInventory: Q1;
  QuantityInStock: Q1;
  QuantityDemandedInMonthX: Q1;
  NumberOfunfinishedPRsAndPOsOfMonthX: Q1;
  InventoryOfMonthX: Q1;
  QuantityDemandedInMonthX1: Q1;
  NumberOfunfinishedPRsAndPOsOfMonthN1: Q1;
  InventoryOfMonthX1: Q1;
  QuantityDemandedInMonthX2: Q1;
  NumberOfunfinishedPRsAndPOsOfMonthN2: Q1;
  InventoryOfMonthX2: Q1;
  QuantityDemandedInMonthX3: Q1;
  NumberOfunfinishedPRsAndPOsOfMonthN3: Q1;
  PRMRPQuantity: Q1;
  DeliveryDate: Q1;
  MinInventoryInQuarterX: Q1;
  AverageSalesMonthOfYearX: Q1;
  AverageSalesPlanMonthRegisteredInYearY: Q1;
  NumberMachinesBox: Q1;
  Long: Q1;
  Width: Q1;
  High: Q1;
}

interface OrganizationalTakeType {
  TAKE_PARENT: Employee;
  TAKE_CHILDREN: Employee;
}

interface OrganizationalType {
  COMPANY: COMPANY;
  BLOCK: COMPANY;
  DEPARTMENT: COMPANY;
  PART: COMPANY;
  POSITION: COMPANY;
  EMPLOYEE: COMPANY;
}

interface COMPANY {
  code: string;
  name: string;
  entityName: string;
  lstDataName: string;
  nameShow: string;
}

interface PaymentStatus {
  NEW: AwaitingConfirmation;
  CHECKING: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  CONFIRMED: AwaitingConfirmation;
  REQUEST_CONFIRM: AwaitingConfirmation;
  PAYING: AwaitingConfirmation;
  PAID: AwaitingConfirmation;
  REQUEST_RECHECK: AwaitingConfirmation;
  APPROVED: DaTuChoi;
}

interface PriceListType {
  INBOUND_SHIPMENT: Employee;
}

interface OrderType {
  PRODUCT: Employee;
  SHIPPING: Employee;
}

interface SettingStringTypeDynamic {
  string: Employee;
  number: Employee;
  DynamicConfiguration: Employee;
}

interface SettingString {
  KES_URL: KESURL;
  KTG_URL: KESURL;
  VAT: VAT;
  IMPORT_TAX_PERCENT: VAT;
  SELF_DEFENSE_TAX_PERCENT: VAT;
  CORPORATE_INCOME_TAX_PERCENT: VAT;
  NUMBER_LOAN_MONTHS: VAT;
  INTEREST_EXPENSE_PERCENT: VAT;
  PPR_SERVICE_FEE: VAT;
  RECEIVING_COST_WHEN_PURCHASING_PERCENT: VAT;
  SHIPPING_COST_WHEN_PURCHASING_PERCENT: VAT;
  SHIPPING_AND_HANDLING_WHEN_SELLING_PERCENT: VAT;
  MANAGEMENT_COST_PERCENT: VAT;
  BANKING_COST_PERCENT: VAT;
  INSURANCE_COST_PERCENT: VAT;
  WARRANTY_COST_PERCENT: VAT;
  BONUS_COST_PERCENT: VAT;
}

interface VAT {
  code: string;
  name: string;
  value: number;
  isDeleted: boolean;
  type: string;
}

interface KESURL {
  code: string;
  name: string;
  valueString: string;
  isDeleted: boolean;
  type: string;
}

interface ReferencesInvoice {
  C: Employee;
  P: Employee;
}

interface ActivityGroup {
  T001: Employee;
  T003: Employee;
  T007: Employee;
}

interface ActivityCode {
  TM_MUA: Employee;
  TC_MUA: Employee;
  TT_MUA: Employee;
}

interface TaskGroup {
  T007: Employee;
  T010: Employee;
  T009: Employee;
}

interface CodeGroup {
  TM_NCC: Employee;
  TC_NCC: Employee;
  TT_NCC: Employee;
}

interface ComplaintAggregationStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  CHECK_AGAIN: AwaitingConfirmation;
  WAIT_NCC_CONFIRMATION: AwaitingConfirmation;
  NCC_VIEWED: AwaitingConfirmation;
  SUPPLIER_AGREES: AwaitingConfirmation;
  SUPPLIER_REFUSED: AwaitingConfirmation;
  EXCHANGE: AwaitingConfirmation;
  COMPLETED: AwaitingConfirmation;
}

interface ComplaintStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  APPROVE: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  CHECK_AGAIN: AwaitingConfirmation;
  WAIT_NCC_CONFIRMATION: WAITNCCCONFIRMATION;
  HAS_AGGREGATION: WAITNCCCONFIRMATION;
  SUPPLIER_AGREES: AwaitingConfirmation;
  SUPPLIER_REFUSED: AwaitingConfirmation;
  COMPLETED: AwaitingConfirmation;
}

interface WAITNCCCONFIRMATION {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  backgroundColor: string;
}

interface ChoiceComplaintYESNO {
  NO: Employee;
  YES: Employee;
}

interface ChoiceComplaintVW4 {
  C0001: Employee;
}

interface ChoiceComplaintVW3 {
  C0001: Employee;
  C0002: Employee;
  C0003: Employee;
}

interface ChoiceComplaintVW1 {
  C0001: Employee;
  C0002: Employee;
}

interface ChoiceComplaintQM {
  C1: Employee;
  C2: Employee;
  C3: Employee;
}

interface ChoiceComplaintMeasure {
  C0001: Employee;
  C0002: Employee;
  C0003: Employee;
  C0004: Employee;
}

interface ChoiceComplaintKTQM {
  C01: Employee;
  C02: Employee;
  C03: Employee;
  C04: Employee;
  C05: Employee;
  C06: Employee;
  C07: Employee;
  C08: Employee;
  C09: Employee;
  C10: Employee;
  C11: Employee;
  C12: Employee;
  C13: Employee;
  C14: Employee;
}

interface CodingComplaint {
  KT_QM: Employee;
  MEASURE: Employee;
  QM: Employee;
  VW1: Employee;
  VW2: Employee;
  VW3: Employee;
  VW4: Employee;
  YESNO: Employee;
}

interface ReferenceComplaintType {
  PO: Employee;
  INBOUND: Employee;
  INSPECTION_LOT: Employee;
  COMPLAINT: Employee;
  REF_NOTI_DMS: Employee;
  MANUAL: Employee;
}

interface ComplaintInspectionLotStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  APPROVE: AwaitingConfirmation;
}

interface ComplaintTemplateStatus {
  ACTIVE: AwaitingConfirmation;
  INACTIVE: AwaitingConfirmation;
}

interface ComplaintTypeCompanyGroup {
  WELDING_MATERIAL: Employee;
  WOOD: Employee;
  GX_MB: Employee;
  DECOR: Employee;
}

interface ComplaintType {
  Q2: Employee;
}

interface BidType {
  PLAN: Employee;
  SURVEY: Employee;
  SHIPMENT: Employee;
}

interface ContractInspectionType {
  Q: Employee;
  P: Employee;
}

interface BaseAdjust {
  QUANTITY: Employee;
  PRICE: Employee;
  BOTH: Employee;
}

interface ReceiptBudgetType {
  PR: Employee;
  PO: Employee;
  BILL: Employee;
}

interface ProposeBudgetType {
  FIRST_PERIOD: Employee;
  DURING_PERIOD: Employee;
  TRANSFER_BUDGET: Employee;
  LAST_BUDGET: Employee;
}

interface ContractAppendixStatus {
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  REQUEST_RE_CHECK: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  WAIT_ACTIVE: AwaitingConfirmation;
  PROCESSING: AwaitingConfirmation;
  DONE: AwaitingConfirmation;
}

interface Platform {
  WEB_ADMIN: Employee;
  APP: Employee;
}

interface BillPaymentStatus {
  NEW: AwaitingConfirmation;
  PAID: AwaitingConfirmation;
}

interface BillStatusSupplier {
  SUPPLIER_UPDATED: AwaitingConfirmation;
  REQUEST_UPDATE: AwaitingConfirmation;
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  UPDATE: AwaitingConfirmation;
  WAIT_CONFIRM: AwaitingConfirmation;
  REQUEST_RE_CHECK: AwaitingConfirmation;
  CONFIRMED: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
}

interface BillStatus {
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  MIRO: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
}

interface CompanyLevel {
  SUBSIDIARY: AwaitingConfirmation;
  GROUP: AwaitingConfirmation;
}

interface PrItemClosed {
  H: AwaitingConfirmation;
  X: AwaitingConfirmation;
  L: AwaitingConfirmation;
}

interface ReferenceSourcePo {
  CONTRACT: Employee;
  BID: Employee;
  AUCTION: Employee;
  PR: Employee;
  RECOMMENDED_PURCHASE: Employee;
  SHIPMENT_COST: Employee;
}

interface ContractInspectionStatus {
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  COMPLETE: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
}

interface REFERENCESOURCE {
  PR: Employee;
  BID: Employee;
  AUCTION: Employee;
  RECOMMENDED_PURCHASE: Employee;
}

interface LockType {
  LOCK: Employee;
  UNLOCK: Employee;
}

interface QuickPriceType {
  PR: Employee;
  ExMatGr: Employee;
}

interface AuctionOutsideType {
  BID: Employee;
  PR: Employee;
  OFFER: Employee;
}

interface AuctionType {
  BID: Employee;
  PR: Employee;
  MatGroup: Employee;
  File: Employee;
}

interface RatingType {
  WEAK: Employee;
  MEDIUM: Employee;
  RATHER: Employee;
  GOOD: Employee;
  VERY_GOOD: Employee;
}

interface SupplierType2 {
  NEW: Employee;
  POTENTIAL: Employee;
  OFFICIAL: Employee;
}

interface TemplateSupplierType {
  SCENE: Employee;
  PURCHASEHISTORY: Employee;
}

interface PurchasingSource {
  HO: Employee;
  OS: Employee;
}

interface RequestUpdateStatusSupplier {
  ACTIVE: AwaitingConfirmation;
  DISCONTINUED: AwaitingConfirmation;
  WAIT_APPROVE_DISCONTINUED: AwaitingConfirmation;
  WAIT_APPROVE_ACTIVE: AwaitingConfirmation;
}

interface RoleType {
  CRUD_PR: CRUDPR;
  APPROVE_PR: CRUDPR;
  CRUD_PO: CRUDPR;
  APPROVE_PO: CRUDPR;
}

interface CRUDPR {
  code: string;
  name: string;
  dbCol: string[];
}

interface SupplierUpgradeStatus {
  NEW: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  APPROVED: AwaitingConfirmation;
  PENDING: AwaitingConfirmation;
  DROP: AwaitingConfirmation;
}

interface HistoryPurchase {
  NEW: AwaitingConfirmation;
  COMPLETE: AwaitingConfirmation;
  EVALUATING: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  REVIEW: AwaitingConfirmation;
  PENDING: AwaitingConfirmation;
}

interface SupplierReplyStatus {
  REPLIED: AwaitingConfirmation;
  NOT_REPLY: AwaitingConfirmation;
  NOT_REQUIRED: AwaitingConfirmation;
}

interface SiteAssessmentStatus {
  WAIT_EVALUATE: AwaitingConfirmation;
  CONSIDERING: AwaitingConfirmation;
  APPROVING: AwaitingConfirmation;
  REQUEST_RE_CHECK: AwaitingConfirmation;
  COMPLETE: AwaitingConfirmation;
}

interface ZTCODE {
  ME51N: Employee;
  ME52N: Employee;
  ME54N: Employee;
  ME41: Employee;
  ME31K: Employee;
  ME21N: Employee;
  VL31N: Employee;
  VT01N: Employee;
  VI01: Employee;
}

interface ValuationType {
  Null: Employee;
  V15X: Employee;
  V150: Employee;
  V155: Employee;
}

interface ReferenceType {
  PR: Employee;
  BusinessPlan: Employee;
  Quote: Employee;
}

interface OfferStatus {
  MoiTao: AwaitingConfirmation;
  ChoDuyet: AwaitingConfirmation;
  DaDuyet: AwaitingConfirmation;
  HoanTatCauHinh: AwaitingConfirmation;
  DangCauHinhGoiThau: AwaitingConfirmation;
  DangDamPhanGia: NEW;
  DongThau: DongThau;
  HoanTatDanhGia: DongThau;
  DongDamPhanGia: NEW;
  DaCongKhai: AwaitingConfirmation;
  NopBaoGia: AwaitingConfirmation;
  DanhGiaNCC: AwaitingConfirmation;
  ChoDuyetKetQua: AwaitingConfirmation;
  Huy: AwaitingConfirmation;
}

interface DongThau {
  code: string;
  name: string;
  statusColor: string;
  statusBorderColor: string;
  statusBgColor: string;
}

interface OfferSupplierStatus {
  NEW: AwaitingConfirmation;
  TEMP_SAVE: AwaitingConfirmation;
  SEND: AwaitingConfirmation;
}

interface SupplierUpdateType {
  Law: Employee;
  Capacity: Employee;
  Lock_Supplier: Employee;
  Lock_Supplier_Service: Employee;
  Supplier_Upgrade: Employee;
}

interface RequestUpdateStatus {
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  APPROVED: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  DESTROY: AwaitingConfirmation;
}

interface SupplierNumberSyncStatus {
  SYNCED: AwaitingConfirmation;
  NOT_SYNC: AwaitingConfirmation;
}

interface SupplierNumberAprovalStatus {
  NEW: AwaitingConfirmation;
  IMPORTING: AwaitingConfirmation;
  PENDING: AwaitingConfirmation;
  APPROVED: AwaitingConfirmation;
  RECHECK: AwaitingConfirmation;
  ERROR: AwaitingConfirmation;
}

interface SupplierNumberSettingAction {
  View: ChuaTao;
  Mutation: ChuaTao;
}

interface SupplierType {
  NEW: Employee;
  POTENTIAL: Employee;
  OFFICIAL: Employee;
  TRANSIENT: Employee;
}

interface PRSouceType {
  PMS: Employee;
  SAP: Employee;
}

interface RATETYPE {
  TECH: Employee;
  PRICE: Employee;
  TRADE: Employee;
}

interface APPROVETYPE {
  DONE: Employee;
  NOT_DONE: Employee;
}

interface SapCode {
  Z01: Z01;
  Z02: Z01;
  Z03: Z01;
  Z04: Z01;
  Z05: Z01;
  Z06: Z01;
  Z07: Z01;
  Z08: Z01;
  Z09: Z01;
  Z88: Z01;
  Z91: Z01;
}

interface Z01 {
  code: string;
  name: string;
  groupName: string;
  start: number;
  end: number;
}

interface FlowCode {
  ZPR1: Employee;
  ZPR2: Employee;
  ZPR3: Employee;
  ZPR4: Employee;
  ZPR5: Employee;
  ZPR6: Employee;
  ZPR7: Employee;
  ZPO1: Employee;
  ZPO2: Employee;
  ZPO3: Employee;
  ZPO4: Employee;
  ZPO5: Employee;
  ZPO6: Employee;
  ZPO7: Employee;
  ZPO8: Employee;
  ZPO9: Employee;
  ZP11: Employee;
  ZP13: Employee;
  ZP14: Employee;
  ZP15: Employee;
  ZP16: Employee;
  ZP17: Employee;
  ZP18: Employee;
  ZP19: Employee;
  ZP20: Employee;
  ZP21: Employee;
  SPL: Employee;
  SNL: Employee;
  SAP_CODE: Employee;
  RUSL: Employee;
  RUSC: Employee;
  LS: Employee;
  LSS: Employee;
  LSMH: Employee;
  SUPPLIER_UPGRADE: Employee;
  TTNLNCC: Employee;
  BID: Employee;
  AUCTION: Employee;
  EVALUATE_RESULT_CAPACITY: Employee;
  EVALUATE_RESULT_TRADE: Employee;
  SUPPLIER_WIN_BID: Employee;
  SUPPLIER_WIN_OFFER: Employee;
  FINISH_BID: Employee;
  CONTRACT: Employee;
  CONTRACT_APPENDIX: Employee;
  CONTRACT_INSPECTION: Employee;
  PO: Employee;
  BUSINESSPLAN: Employee;
  RECOMMENDEDPURCHASE_TEMPLATE: Employee;
  COMPLAINT: Employee;
  COMPLAINT_AGGREGATION: Employee;
  PAYMENT: Employee;
  PLAN_SITE_ASSESSMENT: Employee;
  SITE_ASSESSMENT: Employee;
  RESERVATION: Employee;
  RESERVATION_MAINTENANCE: Employee;
  SUPPLIER_POTENTIAL: Employee;
  SHIPMENT_YEAR: Employee;
  SHIPMENT_MONTH: Employee;
  SHIPMENT_PLAN: Employee;
  REQUEST_QUOTE: Employee;
  BUSINESS_PLAN_TEMPLATE_P101: Employee;
  BUSINESS_PLAN_TEMPLATE_P210: Employee;
  BUSINESS_PLAN_TEMPLATE_P510: Employee;
  BUSINESS_PLAN_TEMPLATE_Intermediary: Employee;
  BUSINESS_PLAN_TEMPLATE_P610: Employee;
  BUSINESS_PLAN_TEMPLATE_P701: Employee;
  PURCHASING_PLAN: Employee;
  APPROVED_RFQ: Employee;
  APPROVED_RECOMMEND_PURCHASE: Employee;
  APPROVED_PURCHASE_PLAN: Employee;
  BILL: Employee;
  MATERIAL: Employee;
  BIDDING: Employee;
  INBOUND: Employee;
  MATERIAL_LOCK_UNLOCK: Employee;
  MATERIAL_ADJUST: Employee;
  RECOMMENDED_SHIPMENT: Employee;
  PRPERIOD: Employee;
}

interface ApproveStatus {
  Active: Employee;
  InRelease: Employee;
  ReleaseRefused: Employee;
  ReleaseCompleted: Employee;
}

interface BlockStatusItem {
  NotBlocked: Employee;
  BlockByRequester: Employee;
}

interface PRStatusItem {
  NotEdited: Employee;
  Edited: Employee;
}

interface BudgetStatus {
  WAIT_EPAY: WAITEPAY;
  NEW: WAITEPAY;
  REJECT: WAITEPAY;
  APPROVED: WAITEPAY;
}

interface WAITEPAY {
  code: string;
  name: string;
  color: string;
  backgroundColor: string;
  statusBorderColor: string;
}

interface PRAsyncStatus {
  NEW: Employee;
  SENDED: Employee;
  SUCCESS: Employee;
  ERROR: Employee;
}

interface Quotation {
  AN: AN;
  ZBH: AN;
}

interface AN {
  code: string;
  name: string;
  From: number;
  To: number;
}

interface PRType {
  ZPR1: ZPR1;
  ZPR2: ZPR1;
  ZPR3: ZPR1;
  ZPR4: ZPR1;
  ZPR5: ZPR1;
  ZPR6: ZPR1;
  ZPR7: ZPR1;
}

interface ZPR1 {
  code: string;
  name: string;
  description: string;
  From: number;
  To: number;
}

interface Role {
  TGD: Employee;
  GDK: Employee;
  TPH: Employee;
  NVI: Employee;
  PPH: Employee;
  GSA: Employee;
  TTR: Employee;
}

interface HeaderItemType {
  HEADER: Employee;
  ITEM: Employee;
}

interface PercentageType {
  AMOUNT: Employee;
  PERCENTAGE: Employee;
  FIXED_AMOUNT: Employee;
}

interface PoOrder {
  REVICED: NgungHoatDong;
  DOING: NgungHoatDong;
  EXPECT_COMPLETE: NgungHoatDong;
  INVENTORY: NgungHoatDong;
  WAIT_REPLY: NgungHoatDong;
  COMPLETE: AwaitingConfirmation;
}

interface PriceScoreCalculateWay {
  SumScore: Employee;
  SumPrice: Employee;
  SumUnitPrice: Employee;
}

interface AuctionStatus {
  N: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  A: AwaitingConfirmation;
  P: AwaitingConfirmation;
  R: DaTuChoi;
  C: DaTuChoi;
  B: DaTuChoi;
}

interface AuctionSupplierStatus {
  NEW: NEW;
  AUCTION: NEW;
  REJECT: NEW;
  WAITING: NEW;
  APROVE: NEW;
  NOT_APROVE: NEW;
}

interface NEW {
  code: string;
  name: string;
  color: string;
  statusBorderColor: string;
  statusBgColor: string;
  statusColor: string;
}

interface PartnerFunction {
  Z4: Employee;
  Z5: Employee;
  Z6: Employee;
  Z7: Employee;
  SP: Employee;
}

interface ShippingCondition {
  Z1: Employee;
  Z2: Employee;
  Z3: Employee;
  Z4: Employee;
  Z5: Employee;
  Z6: Employee;
}

interface ShippingType {
  "01": NgungHoatDong;
  "03": NgungHoatDong;
  "04": NgungHoatDong;
  "05": NgungHoatDong;
}

interface ShipmentRoute {
  ROUTE_01: NgungHoatDong;
  ROUTE_02: NgungHoatDong;
  ROUTE_03: NgungHoatDong;
}

interface ShipmentCostType {
  PURCHASE_ORDER: DELIVERYREFUSE;
  SALE_ORDER: DELIVERYREFUSE;
  COMMERCIAL: DELIVERYREFUSE;
}

interface SapShipmentType {
  ZM01: Employee;
  ZM02: Employee;
  ZMM9: Employee;
  ZSH1: Employee;
  ZSH2: Employee;
  ZSH5: Employee;
  ZSH6: Employee;
}

interface ShipmentType {
  PURCHASE_ORDER: DELIVERYREFUSE;
  COMMERCIAL: DELIVERYREFUSE;
}

interface ShipmentRouteType {
  BAC_NAM: Employee;
  NAM_BAC: Employee;
  TRUNG_NAM: Employee;
  NAM_TRUNG: Employee;
  BAC_TRUNG: Employee;
  TRUNG_BAC: Employee;
}

interface ShipmentRouteStatus {
  ACTIVE: ChoXacNhan;
  INACTIVE: ChoXacNhan;
}

interface ShipmentV3Status {
  NEW: AwaitingConfirmation;
  PLANNING: AwaitingConfirmation;
  AWAITING_DELIVERY: AwaitingConfirmation;
  AWAITING_VESSEL_BOOKING: AwaitingConfirmation;
  AWAITING_BOOKING: AwaitingConfirmation;
  AWAITING_LOADING: AwaitingConfirmation;
  ARRIVED_LOADING_PORT: AwaitingConfirmation;
  IN_TRANSIT: AwaitingConfirmation;
  ARRIVED_DISCHARGE_PORT: AwaitingConfirmation;
  ARRIVED_DESTINATION_PORT: AwaitingConfirmation;
  AWAITING_DOCUMENTS: AwaitingConfirmation;
  AWAITING_TAX_PAYMENT: AwaitingConfirmation;
  CUSTOMS_CLEARANCE_IN_PROGRESS: AwaitingConfirmation;
  HAULING_CARGO_TO_WAREHOUSE: AwaitingConfirmation;
  ARRIVED_WAREHOUSE: AwaitingConfirmation;
  UNLOADING_IN_PROGRESS: AwaitingConfirmation;
  UNLOADING_COMPLETED: AwaitingConfirmation;
  AWAITING_QUALITY_CHECK: AwaitingConfirmation;
  AWAITING_ACCEPTANCE: AwaitingConfirmation;
  AWAITING_INSPECTION_RESULT: AwaitingConfirmation;
  AWAITING_DECLARATION_SUBMISSION: AwaitingConfirmation;
  AWAITING_DOCS_TRANSFER_TO_ACCOUNTING: AwaitingConfirmation;
  AWAITING_FEE_SETTLEMENT: AwaitingConfirmation;
  AWAITING_TAX_REFUND: AwaitingConfirmation;
  HANDLING_COMPLAINT: AwaitingConfirmation;
  PAYMENT_AFTER_RECEIPT: AwaitingConfirmation;
  COMPLETED: AwaitingConfirmation;
  CONTRACT_CANCELLED: AwaitingConfirmation;
  DRAFT: AwaitingConfirmation;
}

interface ShipmentV2Status {
  NEW: AwaitingConfirmation;
  PLANNING: AwaitingConfirmation;
  CHECK_IN: AwaitingConfirmation;
  LOADING_START: AwaitingConfirmation;
  LOADING_END: AwaitingConfirmation;
  SHIPMENT_COMPLETION: AwaitingConfirmation;
  SHIPMENT_START: AwaitingConfirmation;
  SHIPMENT_END: AwaitingConfirmation;
  WAIT_DELIVERY: AwaitingConfirmation;
  WAIT_BOOK_SHIP: AwaitingConfirmation;
  WAIT_BOOKING: AwaitingConfirmation;
  WAIT_LOAD: AwaitingConfirmation;
}

interface ShipmentStatus {
  NEW: AwaitingConfirmation;
  WAITING: AwaitingConfirmation;
  IMPORTED: AwaitingConfirmation;
  APPROVED: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
}

interface InboundItemLeadTimeType {
  PREPARATION: AwaitingConfirmation;
  PRODUCTION: AwaitingConfirmation;
  SHIPPING: AwaitingConfirmation;
  INSPECTION: AwaitingConfirmation;
  WAREHOUSE_ENTRY: AwaitingConfirmation;
}

interface InboundStatus {
  NEW: ChoXacNhan;
  PENDING_CONFIRMATION: ChoXacNhan;
  CONFIRMED: ChoXacNhan;
  PREPARING: ChoXacNhan;
  IN_PRODUCTION: ChoXacNhan;
  INSPECTION: ChoXacNhan;
  IN_TRANSIT: ChoXacNhan;
  WAREHOUSE_RECEIVING: ChoXacNhan;
  WAIT_RECEIVED: ChoXacNhan;
  RECEIVED: ChoXacNhan;
  IN_PROGRESS: ChoXacNhan;
  APPROVED: ChoXacNhan;
  CANCEL: ChoXacNhan;
  CHECK_AGAIN: ChoXacNhan;
  PENDING_ADMIN: ChoXacNhan;
  COMPLETE: ChoXacNhan;
}

interface OutboundStatus {
  NEW: NgungHoatDong;
  APPROVED: NgungHoatDong;
  CANCEL: NgungHoatDong;
}

interface DeliveryDateStatus {
  EQUAL: NgungHoatDong;
  MISS: NgungHoatDong;
  UP_COMMING: NgungHoatDong;
}

interface DataWarningType {
  PR_Plan: Employee;
  PR_Aries: Employee;
  Purchase_Plan: Employee;
  Contract: Employee;
  Bid: Employee;
}

interface WarningType {
  Purchare_Plan_Expiry: PurcharePlanExpiry;
  Purchare_Plan_Over_Budget: PurcharePlanExpiry;
  Contract_Coming_Expiry: PurcharePlanExpiry;
  Contract_Expiry_Payment: PurcharePlanExpiry;
  Bid_Expiry_Setting_Evalution: PurcharePlanExpiry;
}

interface PurcharePlanExpiry {
  code: string;
  name: string;
  default: string;
}

interface SchemeStatus {
  MoiTao: NgungHoatDong;
  DaDuyet: NgungHoatDong;
  Huy: NgungHoatDong;
}

interface DatetimeFilter {
  Month: Employee;
  Quarterly: Employee;
  Year: Employee;
}

interface DatetimeQuarterly {
  Q1: Q1;
  Q2: Q1;
  Q3: Q1;
  Q4: Q1;
}

interface Q1 {
  code: string;
  name: string;
  value: number;
}

interface Evaluate {
  A: Employee;
  B: Employee;
  C: Employee;
  D: Employee;
  E: Employee;
}

interface KPIRating {
  Pass: Employee;
  Fail: Employee;
}

interface SourceType {
  Admin: Employee;
  Client: Employee;
}

interface ContractTypePo {
  NonContract: Employee;
  Contract: Employee;
}

interface PRStatus {
  H: DaTuChoi;
  S: DaTuChoi;
  C_PR: DaTuChoi;
  C: DaTuChoi;
  W_A: DaTuChoi;
  A: DaTuChoi;
  C_A: DaTuChoi;
  R: DaTuChoi;
}

interface ShipmentConditionType {
  YEAR: ChuaTao;
  MONTH: ChuaTao;
  CANCEL: Employee;
  REVERT: Employee;
}

interface PurchaseOrderStatus {
  HOLD: DaTuChoi;
  PARK: DaTuChoi;
  SAVED: DaTuChoi;
  DELIVERYREFUSE: DELIVERYREFUSE;
  DELIVERY: DELIVERYREFUSE;
  CHECK_AGAIN: DaTuChoi;
  WAITING_APPROVAL: DaTuChoi;
  COMPLETE: DaTuChoi;
  CANCEL: DaTuChoi;
  CLOSED: DaTuChoi;
  APPROVED: DaTuChoi;
  REJECT: DaTuChoi;
}

interface DELIVERYREFUSE {
  code: string;
  name: string;
  description: string;
  color: string;
}

interface PurchaseOrderPayMent {
  Unpaid: ChuaTao;
  SuggestPaid: ChuaTao;
  Partial: ChuaTao;
  Paid: ChuaTao;
}

interface ContractTypeAppendix {
  CHANGE_TIME: Employee;
  CHANGE_RULES: Employee;
  CHANGE_OTHER: Employee;
}

interface PaymentProgressStatus {
  Unpaid: Employee;
  Partial: Employee;
  Paid: Employee;
}

interface PORoleCode {
  View: ChuaTao;
  Edit: ChuaTao;
  Confirm: ChuaTao;
  PurchaseOrderPayMent: ChuaTao;
  Cancel: ChuaTao;
}

interface ContractStatus {
  TEMPORARY: AwaitingConfirmation;
  NEW: AwaitingConfirmation;
  WAIT_APPROVE: AwaitingConfirmation;
  REQUEST_RE_CHECK: AwaitingConfirmation;
  CANCEL: AwaitingConfirmation;
  WAIT_ACTIVE: AwaitingConfirmation;
  PROCESSING: AwaitingConfirmation;
  DONE: AwaitingConfirmation;
  REJECT: AwaitingConfirmation;
}

interface StatusServiceCapacity {
  ChuaDuyet: Employee;
  GuiDuyet: Employee;
  DaDuyet: Employee;
}

interface ColType {
  MPO: Employee;
  Supplier: Employee;
}

interface NotifyStatus {
  ChuaDoc: Employee;
  DaDoc: Employee;
}

interface EmailStatus {
  Success: Employee;
  Fail: Employee;
}

interface SQSMessageType {
  Test: string;
  Email: string;
  Material: string;
}

interface DataHistoryTable {
  Supplier: string;
  SupplierCapacity: string;
}

interface EmailTemplate {
  SendConfirmCode: Employee;
  FinishEvaluation: Employee;
  UpdateBidSuccess: Employee;
  SupplierBidSuccess: Employee;
  SendEmailBid: Employee;
}

interface BidAuctionSupplierStatus {
  DangGuiDauGia: AwaitingConfirmation;
  DangDauGia: AwaitingConfirmation;
  DaDauGia: AwaitingConfirmation;
  DaXacNhan: AwaitingConfirmation;
  DaTuChoi: AwaitingConfirmation;
}

interface BidAuctionStatus {
  DangDauGia: AwaitingConfirmation;
  DaTuChoi: DaTuChoi;
  DongDauGia: AwaitingConfirmation;
}

interface DaTuChoi {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

interface BidDealSupplierStatus {
  DangDamPhan: AwaitingConfirmation;
  DaGuiGiaMoi: AwaitingConfirmation;
  DaTuChoi: AwaitingConfirmation;
}

interface BidDealStatus {
  DangDamPhan: AwaitingConfirmation;
  DongDamPhanGia: AwaitingConfirmation;
}

interface BidRuleType {
  MPO: ChuaTao;
  MPOLeader: ChuaTao;
  Tech: ChuaTao;
  TechLeader: ChuaTao;
  Memmber: ChuaTao;
  Other: ChuaTao;
  EmpTech: ChuaTao;
  EmpOther: ChuaTao;
}

interface BidSupplierTechStatus {
  KhongXacNhan: Employee;
  ChuaXacNhan: Employee;
  DangBoSung: Employee;
  DangDanhGia: Employee;
  DaXacNhan: Employee;
  DaDuyet: Employee;
}

interface BidSupplierFileStatus {
  ChuaKiemTra: Employee;
  HopLe: Employee;
  KhongHopLe: Employee;
}

interface BidSupplierStatus {
  DaDuocChon: Employee;
  DaThongBaoMoiThau: Employee;
  DaXacNhanKhongThamGiaThau: Employee;
  DaXacNhanThamGiaThau: Employee;
  DaHoanThanhBoSungHoSo: Employee;
  DangDanhGia: Employee;
  DaDanhGia: Employee;
}

interface BidHistoryStatus {
  SaoChepGoiThau: Employee;
  TaoGoiThauExcel: Employee;
  TaoGoiThau: Employee;
  SuaTaoGoiThau: Employee;
  SuaTaoGoiThauSauDuyet: Employee;
  YeuCauDuyetGoiThauTam: Employee;
  TuChoiGoiThauTam: Employee;
  DuyetGoiThauTam: Employee;
  DuyetThauNhanh: Employee;
  TaoKyThuat: Employee;
  TuChoiTaoKyThuat: Employee;
  DuyetTaoKyThuat: Employee;
  TaoThuongMai: Employee;
  TuChoiThuongMai: Employee;
  DuyetThuongMai: Employee;
  TaoGia: Employee;
  DuyetGia: Employee;
  ChonNCC: Employee;
  ChonLaiNCC: Employee;
  GuiMPOLeader: Employee;
  TuChoiGoiThau: Employee;
  DuyetGoiThau: Employee;
  NhanBaoGia: Employee;
  EmailNhacMoThauLan1: Employee;
  EmailNhacMoThauLan2: Employee;
  MoThau: Employee;
  DanhGiaKyThuat: Employee;
  TuChoiDanhGiaKyThuat: Employee;
  DuyetDanhGiaKyThuat: Employee;
  DanhGiaThuongMai: Employee;
  DanhGiaGia: Employee;
  TuChoiDanhGiaThuongMai: Employee;
  DuyetDanhGiaThuongMai: Employee;
  HieuChinhBangGia: Employee;
  HoanTatHieuChinhBangGia: Employee;
  KetThucNopChaoGiaHieuChinh: Employee;
  TaoDamPhanGia: Employee;
  DongDamPhanGia: Employee;
  TaoDauGia: Employee;
  DongDauGia: Employee;
  ThamDinh: Employee;
  DuyetThamDinh: Employee;
  XacNhanNCCTrungThau: Employee;
  PheDuyetNCCThangThau: Employee;
  TuChoiNCCThangThau: Employee;
  YeuCauKiemTraLai: Employee;
  GuiYeuCauPheDuyetKetThucThau: Employee;
  PheDuyetKetThucThau: Employee;
  PheDuyetKetQua: Employee;
  Huy: Employee;
  YeuCauHuyGoiThau: Employee;
  XacNhanHuyGoiThau: Employee;
  YeuCauDuyetThongTinKiThuat: Employee;
}

interface BidSupplierResetPriceStatus {
  KhongYeuCau: ChuaTao;
  YeuCauBoSung: ChuaTao;
  DaBoSung: ChuaTao;
}

interface BidResetPriceStatus {
  ChuaTao: ChuaTao;
  DangTao: ChuaTao;
  DaTao: ChuaTao;
  KetThuc: ChuaTao;
}

interface ChuaTao {
  code: string;
  name: string;
  description: string;
}

interface BidTradeRateStatus {
  ChuaTao: Employee;
  DangTao: Employee;
  DaTao: Employee;
  TuChoi: Employee;
  DaDuyet: Employee;
}

interface BidTechRateStatus {
  ChuaTao: Employee;
  DangTao: Employee;
  DaTao: Employee;
  GuiDuyet: Employee;
  TuChoi: Employee;
  DaDuyet: Employee;
  ChuaDuyet: Employee;
}

interface BidChooseSupplierStatus {
  ChuaChon: Employee;
  DangChon: Employee;
  DaChon: Employee;
  GuiDuyet: Employee;
  TuChoi: Employee;
  DaDuyet: Employee;
}

interface BidTradeStatus {
  DangTao: Employee;
  GuiDuyet: Employee;
  DaTao: Employee;
  TuChoi: Employee;
  DaDuyet: Employee;
}

interface BidTechStatus {
  ChoDuyet: Employee;
  DangTao: Employee;
  DaTao: Employee;
  TuChoi: Employee;
  DaDuyet: Employee;
}

interface BidStatus {
  T: AwaitingConfirmation;
  N: AwaitingConfirmation;
  TC: AwaitingConfirmation;
  W_A: AwaitingConfirmation;
  P_A: AwaitingConfirmation;
  C_A: AwaitingConfirmation;
  P: AwaitingConfirmation;
  R: AwaitingConfirmation;
  C: AwaitingConfirmation;
  E_A: AwaitingConfirmation;
  E: AwaitingConfirmation;
  F_E: AwaitingConfirmation;
  A: AwaitingConfirmation;
  B: AwaitingConfirmation;
  F_B: AwaitingConfirmation;
  S: AwaitingConfirmation;
  R_C: AwaitingConfirmation;
  D: AwaitingConfirmation;
  F_D: AwaitingConfirmation;
}

interface DataType {
  String: Employee;
  Number: Employee;
  File: Employee;
  List: Employee;
  Date: Employee;
  Address: Employee;
  Km: Employee;
  Time: Employee;
}

interface BannerClientPosition {
  Top: Employee;
}

interface BannerClientType {
  Video: Employee;
  Image: Employee;
}

interface SettingStringClientType {
  BannerName: Employee;
  Footer1: Employee;
  Footer2: Employee;
  Footer3: Employee;
}

interface SettingStringType {
  address: string;
  paymentType: string;
  company: string;
  masterBidGuarantee: string;
  unit: string;
  currency: string;
}

interface SupplierExpertiseDetailType {
  Law: Employee;
  Capacity: Employee;
}

interface SupplierExpertiseCapacityStatus {
  ChuaThamDinh: Employee;
  GuiDuyet: Employee;
  KhongThamDinh: Employee;
  DaThamDinh: Employee;
}

interface SupplierExpertiseLawStatus {
  ChuaThamDinh: Employee;
  KhongThamDinh: Employee;
  DaThamDinh: Employee;
}

interface SupplierExpertiseStatus {
  DangThamDinh: Employee;
  DaThamDinh: Employee;
  KhongDuyetQT2: Employee;
}

interface SupplierServiceExpertiseStatus {
  DaThamDinh: Employee;
  ChuaThamDinh: Employee;
  ChuaDangKy: Employee;
}

interface SupplierServiceStatusCapacity {
  DangDuyet: AwaitingConfirmation;
  TuChoi: AwaitingConfirmation;
  DaDuyet: AwaitingConfirmation;
  NgungHoatDong: NgungHoatDong;
}

interface NgungHoatDong {
  code: string;
  name: string;
  color: string;
}

interface SupplierServiceStatus {
  ChoXacNhan: ChoXacNhan;
  DangDanhGia: ChoXacNhan;
  KhongDat: ChoXacNhan;
  HoatDong: ChoXacNhan;
  DangKhoa: DangKhoa;
}

interface DangKhoa {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  statusColor: string;
  statusBgColor: string;
  borderColor: string;
}

interface ChoXacNhan {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  statusColor: string;
  statusBgColor: string;
  statusBorderColor: string;
}

interface ReferenceInpectionLotType {
  PO: Employee;
  INBOUND: Employee;
  SAP: Employee;
}

interface SupplierLegalStatus {
  DangDuyet: AwaitingConfirmation;
  TuChoi: AwaitingConfirmation;
  DaDuyet: AwaitingConfirmation;
}

interface SupplierStatus {
  AwaitingConfirmation: AwaitingConfirmation;
  LegalReview: AwaitingConfirmation;
  CapacityReview: AwaitingConfirmation;
  InReview: AwaitingConfirmation;
  ReCheck: AwaitingConfirmation;
  Failed: AwaitingConfirmation;
  Active: AwaitingConfirmation;
  Locked: AwaitingConfirmation;
  KTG: AwaitingConfirmation;
  SaveTemp: AwaitingConfirmation;
}

interface AwaitingConfirmation {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface LockSupplier {
  All: Employee;
  Part: Employee;
}

interface SiteEnum {
  WOOD: WOOD;
  WELDING_MATERIAL: WOOD;
}

interface WOOD {
  code: string;
  name: string;
  link: string;
}

interface UserType {
  Employee: Employee;
  Admin: Employee;
  Supplier: Employee;
}

interface Employee {
  code: string;
  name: string;
}

interface Page {
  pageIndex: number;
  pageSize: number;
  pageSizeMax: number;
  total: number;
}
