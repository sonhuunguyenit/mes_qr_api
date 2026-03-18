import { NavigatorScreenParams } from "@react-navigation/native";
import { ROUTE_KEYS } from "../constants/route";

// Auth navigator
export type AuthNavigatorParamList = {
  [ROUTE_KEYS.Login]: undefined;
};

import { PRItemData } from "../services/pr/pr.type";

// App navigator
export type AppNavigatorParamList = {
  [ROUTE_KEYS.Home]: undefined;
  [ROUTE_KEYS.UserInfo]: undefined;
  [ROUTE_KEYS.PR]: {
    isApprove?: boolean;
    listTargetId?: string;
    isNotifyApprove?: boolean;
    type?: string;
  };
  [ROUTE_KEYS.PO]: {
    isApprove?: boolean;
    listTargetId?: string;
    isNotifyApprove?: boolean;
    type?: string;
  };
  [ROUTE_KEYS.Notification]: undefined;
  [ROUTE_KEYS.PRDetail]: { item: PRItemData };
  [ROUTE_KEYS.PODetail]: { item: any };
  [ROUTE_KEYS.Preview]: { uri: string; title?: string };
};

// Root navigator
export type RootNavigatorParamList = {
  AuthNavigator: NavigatorScreenParams<AuthNavigatorParamList>;
  AppNavigator: NavigatorScreenParams<AppNavigatorParamList>;
};
