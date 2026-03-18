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

export const goPR = (
  params: { isApprove?: boolean; listTargetId?: string; type?: string } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PR,
    params,
  });

export const goPRDetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PRDetail,
    params: { item },
  });

export const goPO = (
  params: { isApprove?: boolean; listTargetId?: string; type?: string } = {},
) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PO,
    params,
  });

export const goPODetail = (item: any) =>
  navigate(ROUTE_KEYS.AppNavigator, {
    screen: ROUTE_KEYS.PODetail,
    params: { item },
  });

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
