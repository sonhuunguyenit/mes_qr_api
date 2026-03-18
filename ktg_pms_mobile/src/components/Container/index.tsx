import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
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
  backgroundScreen = "transparent",
  backgroundColor = "transparent",
  disableInsetTop = false,
  disableInsetBottom = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          // paddingTop: disableInsetTop ? 0 : insets.top,
          // paddingBottom: disableInsetBottom ? 0 : insets.bottom,
          backgroundColor: backgroundScreen,
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
