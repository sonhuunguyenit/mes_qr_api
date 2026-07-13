export interface MaterialFilterParams {
  status?: string;
  isDeleted?: boolean | string;
  code?: string;
  name?: string;
  materialGroupId?: string;
  externalMaterialGroupId?: string;
  plantId?: string;
  divisionId?: string;
  createdAt?: string[];
  startDate?: string;
  endDate?: string;
  createdByName?: string;
  blockAllDate?: string[];
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  listTargetId?: string;
  type?: string;
}

export interface MaterialSalesItem {
  salesOrganizationCode?: string;
  distributionChannelCode?: string;
  saleUnitCode?: string;
  accountAssignmentGroupCode?: string;
  saleTaxCode?: string;
  exportTaxCode?: string;
  materialStatisticsGroup?: string;
  itemCategoryGroupCode?: string;
  availbleCheckPP?: string;
  transportationGroup?: string;
  loadingGroup?: string;
  matGroup1Code?: string;
  matGroup2Code?: string;
  matGroup3Code?: string;
  matGroup4Code?: string;
  matGroup5Code?: string;
  flagDeteteDistributionChannel?: boolean | string;
}

export interface MaterialUOMItem {
  coefficientX?: number | string;
  uomAlternativeName?: string;
  coefficientY?: number | string;
  oumCode?: string;
  lngth?: number | string;
  width?: number | string;
  height?: number | string;
  unitOfDimensionCode?: string;
  cmb?: number | string;
  unitOfVolumeMaterialUomCode?: string;
  grossWeight?: number | string;
  netWeight?: number | string;
  unitOfMassMaterialUomCode?: string;
}

export interface MaterialItemData {
  id: string;
  code: string;
  name: string;
  matGroup?: string;
  materialGroupId?: string;
  externalMaterialGroupId?: string;
  externalMaterialGroupCode?: string;
  plantId?: string;
  plantCode?: string;
  divisionId?: string;
  divisionTCode?: string;
  createdAt: string;
  createdByName?: string;
  blockAllDate?: string;
  isDeleted: boolean;
  status: string;
  statusName: string;
  statusColor?: string;
  statusBgColor?: string;
  statusBorderColor?: string;
  canApprove?: boolean;
  isCreator?: boolean;
  reason?: string;

  // Write block permissions
  isWriteGenaral?: boolean;
  isWriteSales?: boolean;
  isWritePurchase?: boolean;
  isWriteMRP?: boolean;
  isWriteQM?: boolean;
  isWriteAccounting?: boolean;
  isWriteCosting?: boolean;
  isWriteCoProduct?: boolean;
  isWriteWms?: boolean;

  writeBlockLockedByNames?: Record<string, string>;
  writeBlockPermissionNames?: Record<string, string>;
  writeBlockLockedAts?: Record<string, string>;

  // Detail screen fields
  sapCode?: string;
  oldCode?: string;
  baseUnitCode?: string;
  oldMaterialName?: string;
  materialTypeLable?: string;
  materialGroupLable?: string;
  longText?: string;
  externalMaterialGroupLable?: string;
  englishName?: string;
  purchasingSource?: string;
  representativeName?: string;
  customsName?: string;
  customsDeclarationName?: string;
  productHierarchyName?: string;
  scientificName?: string;
  batch?: string;
  batchCode?: string;
  hsCode?: string;
  customerSpecificCode?: string;

  // Level 5-22 characteristics
  productTypeLevel1Name?: string;
  productTypeLevel1Id?: string;
  productAppearanceLevel2Name?: string;
  productAppearanceLevel2Id?: string;
  physicalPropertiesLevel3Name?: string;
  physicalPropertiesLevel3Id?: string;
  coreAttributesLevel4Name?: string;
  coreAttributesLevel4Id?: string;
  backingAndPackingGroupName?: string;
  backingAndPackingGroupId?: string;
  packingSpecification1Name?: string;
  packingSpecification1Id?: string;
  packingSpecification2Name?: string;
  packingSpecification2Id?: string;
  glueMoldLockingBrandM1Name?: string;
  glueMoldLockingBrandM1Id?: string;
  productLinePatternGroupM1Name?: string;
  productLinePatternGroupM1Id?: string;
  productPatternAndMoldM1Name?: string;
  productPatternAndMoldM1Id?: string;
  formaldehydeGradeColorM1Name?: string;
  formaldehydeGradeColorM1Id?: string;
  productionGradeMoldM1Name?: string;
  productionGradeMoldM1Id?: string;
  overlayPaperDivM2Name?: string;
  overlayPaperDivM2Id?: string;
  balancePaperBrandM2Name?: string;
  balancePaperBrandM2Id?: string;
  patternGroupM2Name?: string;
  patternGroupM2Id?: string;
  patternM2Name?: string;
  patternM2Id?: string;
  colorCodeM2Name?: string;
  colorCodeM2Id?: string;
  moldEffectM2Name?: string;
  moldEffectM2Id?: string;

  numberMachinesBox?: string | number;
  classType?: string;
  flagForDetete?: boolean | string;
  createBy?: string;
  createOn?: string;
  link?: string;
  unit2Code?: string;
  size?: string;
  isMaterialBatch?: boolean;
  imageMaterialUrl?: string;

  // Tab 3 fields: Purchasing - Quality - Costing - Mrp
  purchasingOrderUnitName?: string;
  purchasingGroupLable?: string;
  purchasingTaxClassificationCode?: string;
  manufacturernumber?: string;
  varOun?: string;
  flagForDeteteAtPlantLevel?: boolean | string;
  isBatchManaged?: boolean;
  qmTimeDays?: number | string;
  quality01?: boolean;
  quality05?: boolean;
  quality08?: boolean;
  quality03?: boolean;
  quality89?: boolean;
  quality04?: boolean;
  qualityZCT?: boolean;
  qualityZ1?: boolean;
  qualityZ4?: boolean;
  qualityZ5?: boolean;
  qualityZ6?: boolean;
  qualityZ7?: boolean;

  originGroupCode?: string;
  profitCenterCode?: string;
  doNotCost?: boolean;
  withQuantityStructure?: boolean;
  materialOrigin?: boolean;
  costingLotSize?: number | string;

  mrpProfileCode?: string;
  mrpProfile?: string;
  mrpGroupCode?: string;
  mrpGroup?: string;
  mrpTypeCode?: string;
  mRPType?: string;
  procurementType?: string;
  requirementPlanningType?: string;
  strategyGroup?: string;
  lotSize?: string;
  fixedLotSize?: number | string;
  minLotSize?: number | string;
  maxLotSize?: number | string;
  roundingValue?: number | string;
  safetyStock?: number | string;
  reorderPoint?: number | string;
  mrpControllerCode?: string;
  mrpController?: string;
  deliveryTime?: number | string;
  deliveryTimeDays?: number | string;
  gRProcessingTime?: number | string;
  overdelyTol?: number | string;
  underdelyTol?: number | string;
  productionUnitTCode?: string;
  isCriticalPart?: boolean;
  criticalPart?: boolean;
  assemblyScrapPercent?: number | string;
  componentScrapPercent?: number | string;
  inHouseProduction?: number | string;
  backflushCode?: string;
  hasCoProduct?: boolean;
  schedMarginKey?: string;
  maximumStockLevel?: number | string;
  minSafetyStock?: number | string;
  minimumRemainingShelfLife?: number | string;
  totalShelfLife?: number | string;
  periodIndForSled?: string;
  ccPhysInvIndCode?: string;

  lstUOM?: MaterialUOMItem[];
  lstMaterialSell?: MaterialSalesItem[];
  lstMaterialAccouting?: MaterialAccountingItem[];
  lstMaterialWarehouse?: MaterialWarehouseItem[];
  lstStorageLocation?: MaterialStorageLocationItem[];
  lstMaterialCoProduct?: MaterialCoProductItem[];
  lstMaterialCoProductChild?: MaterialCoProductChildItem[];
}

export interface MaterialAccountingItem {
  valuationArea?: string;
  valuationCategoryCode?: string;
  valuationTypeCode?: string;
  valuationClassCode?: string;
  priceControlIndicator?: string;
  priceDetermination?: string;
  priceUnit?: number | string;
  delType?: boolean | string;
}

export interface MaterialWarehouseItem {
  warehouseCode?: string;
  stockRemovalCode?: string;
  stockPlacementCode?: string;
  storageSectionCode?: string;
  stepPicking?: string;
  bulkStorageCode?: string;
  allowAddnToStock?: boolean;
  leQuantity1?: number | string;
  unitCode1?: string;
  sutCode1?: string;
  leQuantity2?: number | string;
  unitCode2?: string;
  sutCode2?: string;
  leQuantity3?: number | string;
  unitCode3?: string;
  sutCode3?: string;
  delWarehouse?: boolean;
}

export interface MaterialStorageLocationItem {
  storageLocationCode?: string;
  dfStorLocLevel?: boolean | string;
}

export interface MaterialCoProductItem {
  stt?: number | string;
  structureText?: string;
  structureCode?: string;
}

export interface MaterialCoProductChildItem {
  structureCode?: string;
  materialCode2?: string;
  validTo?: string;
  equivalenceNumbers?: number | string;
  apportionmentStruct?: string;
}

export interface MaterialDropdownOption {
  id: string;
  code: string;
  name?: string;
}

export interface MaterialApprovalDto {
  materialId: string;
  materialCode: string;
  plantId?: string;
}

export interface MaterialRejectSyncDto {
  materialId: string;
  reason: string;
  isWriteGenaral: boolean;
  isWriteSales: boolean;
  isWritePurchase: boolean;
  isWriteMRP: boolean;
  isWriteQM: boolean;
  isWriteAccounting: boolean;
  isWriteCosting: boolean;
  isWriteCoProduct: boolean;
  isWriteWms: boolean;
}

