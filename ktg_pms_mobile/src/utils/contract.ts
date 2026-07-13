import { ContractType } from "~/enums/contract.enum";

// sync from contract.component.ts:1685-1695 (approximately)
export const isNTContractType = (contractType?: string): boolean => {
  return (
    contractType === ContractType.ZNT1 ||
    contractType === ContractType.ZNT2 ||
    contractType === ContractType.ZNT3 ||
    contractType === ContractType.ZNT4 ||
    contractType === ContractType.NT
  );
};

// sync from contract.component.ts:1697-1700 (approximately)
export const isZNT5 = (contractType?: string): boolean => {
  return contractType === ContractType.ZNT5;
};
