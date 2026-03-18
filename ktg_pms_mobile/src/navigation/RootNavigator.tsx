import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { useAuth } from "~/hooks/useAuth";
import { useExpoUpdate } from "~/hooks/useExpoUpdate";
import { useWaiting } from "~/hooks/useWaiting";
import { navigationRef, screenTracking } from "~/utils/navigate";
import { ROUTE_KEYS } from "../constants/route";
import AppNavigator from "./AppNavigator";
import { AuthNavigator } from "./AuthNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC<{ theme?: Theme }> = ({ theme }) => {
  const { isUpdating } = useExpoUpdate();
  const { user, isLoadingUser } = useAuth();
  const { start, stop } = useWaiting();

  useEffect(() => {
    if (isUpdating || isLoadingUser) {
      start();
    } else {
      stop();
    }
  }, [isUpdating, isLoadingUser]);

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
