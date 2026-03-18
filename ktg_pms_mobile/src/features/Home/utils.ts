export const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

export const getIconForType = (type: string) => {
  switch (type) {
    case "PR":
    case "APPROVED_RECOMMEND_PURCHASE":
      return "shopping-cart";
    case "PO":
      return "credit-card";
    case "SUPPLIER":
      return "users";
    case "SAP_CODE":
      return "database";
    case "RUSL":
    case "RUSC":
      return "edit-3";
    case "LS":
    case "LSS":
      return "lock";
    case "SUPPLIER_UPGRADE":
      return "award";
    case "LSMH":
    case "EVALUATE_RESULT_CAPACITY":
    case "EVALUATE_RESULT_TRADE":
      return "clipboard";
    case "BID":
      return "briefcase";
    case "PAYMENT":
      return "dollar-sign";
    case "CONTRACT":
    case "CONTRACT_APPENDIX":
      return "file-text";
    case "BUSINESSPLAN":
      return "target";
    case "FINISH_BID":
      return "check-circle";
    default:
      return "grid";
  }
};

export const getIconForTypeName = getIconForType;
