import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import React from "react";
import { DrawerContent } from "~/components";
import { Home, HomeSearch } from "~/features/Home";
import { Notification } from "~/features/Notification";
import { PO, PODetail } from "~/features/PO";
import { PR } from "~/features/PR";
import PRDetail from "~/features/PR/screens/PRDetail";
import {
  SupplierPotential,
  SupplierPotentialDetail,
} from "~/features/Supplier/Potential";
import { SupplierSap, SupplierSapDetail } from "~/features/Supplier/Sap";
import UserInfo from "~/features/UserInfo/screens/UserInfo";
import { SupplierLaw, SupplierLawDetail } from "~/features/Supplier/Law";
import {
  SupplierCapacity,
  SupplierCapacityDetail,
} from "~/features/Supplier/Capacity";
import { SupplierLock, SupplierLockDetail } from "~/features/Supplier/Lock";

import { ROUTE_KEYS } from "../constants/route";
import { AppNavigatorParamList } from "./navigation.type";
import {
  SupplierLockService,
  SupplierLockServiceDetail,
} from "~/features/Supplier";
import { Bid, BidDetail } from "~/features/Bid";
import { BidRate } from "~/features/BidRate";
import {
  ReservationDemand,
  ReservationDemandDetail,
  ReservationMaintenance,
  ReservationMaintenanceDetail,
} from "~/features/Reservation";
import { Contract, ContractDetail } from "~/features/Contract";
import { MaterialApproval, MaterialApprovalDetail } from "~/features/MaterialApproval";


const Drawer = createDrawerNavigator<AppNavigatorParamList>();

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={ROUTE_KEYS.Home}
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
      <Drawer.Screen
        name={ROUTE_KEYS.Home}
        component={Home}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.HomeSearch}
        component={HomeSearch}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.Contract}
        component={Contract}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.ContractDetail}
        component={ContractDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* <Drawer.Screen
        name={ROUTE_KEYS.BottomTabNavigator}
        component={BottomTabNavigator}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      /> */}

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
        name={ROUTE_KEYS.SupplierSap}
        component={SupplierSap}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierSapDetail}
        component={SupplierSapDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierPotential}
        component={SupplierPotential}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierPotentialDetail}
        component={SupplierPotentialDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLaw}
        component={SupplierLaw}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLawDetail}
        component={SupplierLawDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierCapacity}
        component={SupplierCapacity}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.SupplierCapacityDetail}
        component={SupplierCapacityDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLock}
        component={SupplierLock}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLockDetail}
        component={SupplierLockDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLockService}
        component={SupplierLockService}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.SupplierLockServiceDetail}
        component={SupplierLockServiceDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.Bid}
        component={Bid}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name={ROUTE_KEYS.BidDetail}
        component={BidDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      
      <Drawer.Screen
        name={ROUTE_KEYS.BidRate}
        component={BidRate}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.ReservationDemand}
        component={ReservationDemand}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.ReservationDemandDetail}
        component={ReservationDemandDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.ReservationMaintenance}
        component={ReservationMaintenance}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.ReservationMaintenanceDetail}
        component={ReservationMaintenanceDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.MaterialApproval}
        component={MaterialApproval}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name={ROUTE_KEYS.MaterialApprovalDetail}
        component={MaterialApprovalDetail}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

    </Drawer.Navigator>
  );
};

export default AppNavigator;
