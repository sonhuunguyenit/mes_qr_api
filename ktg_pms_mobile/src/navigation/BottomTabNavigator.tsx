import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { ROUTE_KEYS } from "../constants/route";
import { colors } from "~/constants/colors";
import { Home } from "~/features/Home";
import UserInfo from "~/features/UserInfo/screens/UserInfo";

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBarContainer,
      }}
    >
      <Tab.Screen
        name={ROUTE_KEYS.Home}
        component={Home}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid" type="feather" color={color} size={size - 2} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTE_KEYS.UserInfo}
        component={UserInfo}
        options={{
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" type="feather" color={color} size={size - 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 12,
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    height: 74,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: Platform.OS === "ios" ? 0 : 2,
  },
});
