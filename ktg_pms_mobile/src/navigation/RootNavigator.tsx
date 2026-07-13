import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-gesture-handler";
import { useAuth } from "~/hooks/useAuth";
import { useExpoUpdate } from "~/hooks/useExpoUpdate";
import { navigationRef, screenTracking } from "~/utils/navigate";
import { useNotification } from "~/hooks/useNotification";
import { ROUTE_KEYS } from "../constants/route";
import AppNavigator from "./AppNavigator";
import { AuthNavigator } from "./AuthNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC<{ theme?: Theme }> = ({ theme }) => {
  const { isUpdating } = useExpoUpdate();
  const { user, isLoadingUser } = useAuth();

  // Kích hoạt lắng nghe thông báo đẩy & xử lý điều hướng tự động
  useNotification({ user, isLoadingUser });

  if (isLoadingUser || isUpdating) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      onStateChange={screenTracking}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name={ROUTE_KEYS.AppNavigator}
            component={AppNavigator}
          />
        ) : (
          <Stack.Screen
            name={ROUTE_KEYS.AuthNavigator}
            component={AuthNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
