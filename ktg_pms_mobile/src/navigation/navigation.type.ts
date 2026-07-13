import { NavigatorScreenParams } from "@react-navigation/native";
import { ROUTE_KEYS } from "../constants/route";

// Auth navigator
export type AuthNavigatorParamList = {
  [ROUTE_KEYS.Login]: undefined;
};

import { PRItemData } from "../services/pr/pr.type";
import {
  SupplierSapItem,
  SupplierPotentialItem,
} from "../services/supplier/supplier.type";
import { SupplierLawItem } from "../services/supplier/supplier-law.type";
import { SupplierCapacityItem } from "../services/supplier/supplier-capacity.type";
import { SupplierLockItem } from "../services/supplier/supplier-lock.type";
import { ReservationItemData } from "../services/reservation/reservation.type";
import { ContractItemDto } from "../services/contract/contract.type";
import { MaterialItemData } from "../services/material/material.type";

// App navigator
export type AppNavigatorParamList = {
  // [ROUTE_KEYS.BottomTabNavigator]: undefined;
  [ROUTE_KEYS.Home]: undefined;
  [ROUTE_KEYS.HomeSearch]: undefined;
  [ROUTE_KEYS.UserInfo]: undefined;
  [ROUTE_KEYS.PR]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.PO]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.Notification]: undefined;
  [ROUTE_KEYS.PRDetail]: { item: PRItemData };
  [ROUTE_KEYS.PODetail]: { item: any };
  [ROUTE_KEYS.Preview]: { uri: string; title?: string };
  [ROUTE_KEYS.SupplierSap]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierSapDetail]: { item: SupplierSapItem };
  [ROUTE_KEYS.SupplierPotential]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierPotentialDetail]: { item: SupplierPotentialItem };
  [ROUTE_KEYS.SupplierLaw]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierLawDetail]: { item: SupplierLawItem };
  [ROUTE_KEYS.SupplierCapacity]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierCapacityDetail]: { item: SupplierCapacityItem };
  [ROUTE_KEYS.SupplierLock]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierLockDetail]: { item: SupplierLockItem };
  [ROUTE_KEYS.SupplierLockService]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.SupplierLockServiceDetail]: { item: SupplierLockItem };
  [ROUTE_KEYS.Bid]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.BidDetail]: {
    id: string;
    isRate?: boolean;
    isMemeberApproved?: boolean;
  };
  [ROUTE_KEYS.BidRate]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.ReservationDemand]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.ReservationDemandDetail]: { item: ReservationItemData };
  [ROUTE_KEYS.ReservationMaintenance]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.ReservationMaintenanceDetail]: {
    item: ReservationItemData;
    isNotifyApprove?: boolean;
  };
  [ROUTE_KEYS.Contract]: {
    listTargetId?: string[];
    type?: string;
  };
  [ROUTE_KEYS.ContractDetail]: {
    item: ContractItemDto;
    onGoBack?: () => void;
  };
  [ROUTE_KEYS.MaterialApproval]: {
    listTargetId?: string;
    type?: string;
  };
  [ROUTE_KEYS.MaterialApprovalDetail]: { item: MaterialItemData };
};

// Root navigator
export type RootNavigatorParamList = {
  AuthNavigator: NavigatorScreenParams<AuthNavigatorParamList>;
  AppNavigator: NavigatorScreenParams<AppNavigatorParamList>;
};

export type BottomTabNavigatorParamList = {
  [ROUTE_KEYS.Home]: undefined;
  [ROUTE_KEYS.UserInfo]: undefined;
};
