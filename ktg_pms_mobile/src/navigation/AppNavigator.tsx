import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import React from "react";
import { DrawerContent } from "~/components";
import { ROUTE_KEYS } from "../constants/route";
import { AppNavigatorParamList } from "./navigation.type";
import PRDetail from "~/features/PR/screens/PRDetail";
import { PO, PODetail } from "~/features/PO";
import Preview from "~/components/Preview";
import { Notification } from "~/features/Notification";
import { Home } from "~/features/Home";
import { PR } from "~/features/PR";
import UserInfo from "~/features/UserInfo/screens/UserInfo";
import { BottomTabNavigator } from "./BottomTabNavigator";

const Drawer = createDrawerNavigator<AppNavigatorParamList>();

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "front",
        swipeEnabled: false,
        drawerStyle: {
          width: "75%",
          backgroundColor: "transparent",
        },
        drawerItemStyle: {
          backgroundColor: "transparent",
        },
        overlayColor: "rgba(0,0,0,0.15)",
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContent {...props} />
      )}
    >
      {/* <Drawer.Screen
        name={ROUTE_KEYS.BottomTabNavigator}
        component={BottomTabNavigator}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      /> */}

      <Drawer.Screen
        name={ROUTE_KEYS.Home}
        component={Home}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.PR}
        component={PR}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.PRDetail}
        component={PRDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.PO}
        component={PO}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.PODetail}
        component={PODetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.UserInfo}
        component={UserInfo}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.Notification}
        component={Notification}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.Preview}
        component={Preview}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
