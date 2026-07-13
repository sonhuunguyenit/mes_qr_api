import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundScreen?: string;
  backgroundColor?: string;
  disableInsetTop?: boolean;
  disableInsetBottom?: boolean;
};

export const Container = ({
  children,
  style = {},
  backgroundScreen,
  backgroundColor = "transparent",
  disableInsetTop = true,
  disableInsetBottom = true,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const finalBackgroundScreen = backgroundScreen || colors.background;

  return (
    <View
      style={[
        {
          flex: 1,
          marginTop: 5,
          paddingTop: disableInsetTop ? 0 : insets.top,
          paddingBottom: disableInsetBottom ? 0 : insets.bottom,
          // backgroundColor: finalBackgroundScreen,
          paddingHorizontal: 5,
        },
        style,
      ]}
    >
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
