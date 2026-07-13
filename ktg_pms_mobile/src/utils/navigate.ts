import {
  CommonActions,
  createNavigationContainerRef,
  DrawerActions,
  NavigationState,
  StackActions,
} from "@react-navigation/native";
import { ROUTE_KEYS } from "../constants/route";
import { RootNavigatorParamList } from "~/navigation/navigation.type";

export const navigationRef =
  createNavigationContainerRef<RootNavigatorParamList>();

export function navigate<T extends keyof RootNavigatorParamList>(
  screen: T,
  params?: RootNavigatorParamList[T],
) {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(screen as any, params as any);
}

export function navigateAndReset(
  routes: { name: string; params?: object }[],
  index: number = 0,
) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
}

export const goLogin = () =>
  navigate(ROUTE_KEYS.AuthNavigator, {
    screen: ROUTE_KEYS.Login,
  });

export const goHome = () =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.Home,
  });

export const goHomeSearch = () =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.HomeSearch,
  });

export const goNotification = () =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.Notification,
  });

export function goUserInfo() {
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.UserInfo,
  });
}

export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
  } else {
    navigateAndReset([{ name: ROUTE_KEYS.AppNavigator }]);
  }
}

export function push(name: string, params?: any) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function replace(name: string, params?: any) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}

export function pop(count?: number) {
  navigationRef.current?.dispatch(StackActions.pop(count));
}

export function openDrawer() {
  navigationRef.current?.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
  navigationRef.current?.dispatch(DrawerActions.closeDrawer());
}

export const screenTracking = (state: NavigationState | undefined): void => {
  if (!state) return;

  const route = state.routes[state.index];
  if (route.state) {
    screenTracking(route.state as NavigationState);
    return;
  }

  console.log(`NAVIGATING > ${route.name}`);
};

export const getCurrentRoute = (): keyof RootNavigatorParamList | null => {
  const route = navigationRef.getCurrentRoute();
  const name = route?.name;

  return name && name in ROUTE_KEYS
    ? (name as keyof RootNavigatorParamList)
    : null;
};

export const goPR = (params: { listTargetId?: string; type?: string } = {}) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PR,
    params,
  });

export const goPRDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PRDetail,
    params: { item },
  });

export const goPO = (params: { listTargetId?: string; type?: string } = {}) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PO,
    params,
  });

export const goPODetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PODetail,
    params: { item },
  });

export const goSupplierSap = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierSap,
    params,
  });

export const goSupplierSapDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierSapDetail,
    params: { item },
  });

export const goSupplierPotential = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierPotential,
    params,
  });

export const goSupplierPotentialDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierPotentialDetail,
    params: { item },
  });

export const goSupplierLaw = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLaw,
    params,
  });

export const goSupplierLawDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLawDetail,
    params: { item },
  });

export const goContract = (
  params: {
    listTargetId?: string[];
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.Contract,
    params,
  });

export const goContractDetail = (params: {
  item: any;
  onGoBack?: () => void;
}) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.ContractDetail,
    params,
  });

export const goSupplierCapacity = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierCapacity,
    params,
  });

export const goSupplierCapacityDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierCapacityDetail,
    params: { item },
  });

export const goSupplierLock = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLock,
    params,
  });

export const goSupplierLockDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLockDetail,
    params: { item },
  });

export const goSupplierLockService = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLockService,
    params,
  });

export const goSupplierLockServiceDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.SupplierLockServiceDetail,
    params: { item },
  });

export const goBid = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.Bid,
    params,
  });

export const goBidDetail = (
  id: string,
  isRate?: boolean,
  isMemeberApproved?: boolean,
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.BidDetail,
    params: { id, isRate, isMemeberApproved },
  });

export const goBidRate = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.BidRate,
    params,
  });

export const goReservationDemand = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.ReservationDemand,
    params,
  });

export const goReservationDemandDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.ReservationDemandDetail,
    params: { item },
  });

export const goReservationMaintenance = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.ReservationMaintenance,
    params,
  });

export const goReservationMaintenanceDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.ReservationMaintenanceDetail,
    params: { item },
  });

export const goMaterialApproval = (
  params: {
    listTargetId?: string;
    type?: string;
  } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.MaterialApproval,
    params,
  });

export const goMaterialApprovalDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.MaterialApprovalDetail,
    params: { item },
  });

export const goReservationDetail = (item: any, isMaintenance?: boolean) => {
  if (isMaintenance === true) {
    return goReservationMaintenanceDetail(item);
  }
  return goReservationDemandDetail(item);
};

export const goPreview = () =>
  navigate(ROUTE_KEYS.AppNavigator as any, {
    screen: ROUTE_KEYS.Preview,
  });

export default {
  navigate,
  push,
  replace,
  pop,
  popToTop,
  openDrawer,
  closeDrawer,
  navigationRef,
};
