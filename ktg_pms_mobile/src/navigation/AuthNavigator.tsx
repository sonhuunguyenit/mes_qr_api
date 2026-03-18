import Login from "~/features/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTE_KEYS } from "../constants/route";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_KEYS.Login}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTE_KEYS.Login} component={Login} />
    </Stack.Navigator>
  );
};
