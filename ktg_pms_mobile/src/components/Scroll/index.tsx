import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "~/common";

type ScrollProps = {
  full?: boolean;
  gap?: number;
  children: React.ReactNode;
  loading?: boolean;
  skeleton?: React.ReactNode;
  empty?: React.ReactNode;
  error?: string | boolean;
  onRetry?: () => void;
  enableRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  animated?: boolean;
} & ScrollViewProps;

export const Scroll = ({
  full,
  gap = 0,
  children,
  loading,
  skeleton,
  empty,
  error,
  onRetry,
  enableRefresh,
  refreshing,
  onRefresh,
  animated = true,
  contentContainerStyle,
  horizontal,
  ...props
}: ScrollProps) => {
  if (loading) {
    return (
      <View style={styles.center}>
        {skeleton || <ActivityIndicator size="large" />}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 12 }}>
          {typeof error === "string" ? error : "Something went wrong"}
        </Text>
        {onRetry && (
          <Text weight="600" style={styles.retryButton} onPress={onRetry}>
            Retry
          </Text>
        )}
      </View>
    );
  }

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return <View style={styles.center}>{empty || <Text>No Data</Text>}</View>;
  }

  const ScrollWrapper = animated ? Animated.ScrollView : ScrollView;
  const isHorizontal = !!horizontal;

  return (
    <ScrollWrapper
      {...props}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      refreshControl={
        enableRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={[
        {
          flexGrow: full ? 1 : 0,
          flexDirection: isHorizontal ? "row" : "column",
          paddingHorizontal: 5,
          paddingTop: 10,
          ...(gap ? (isHorizontal ? { columnGap: gap } : { rowGap: gap }) : {}),
        },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollWrapper>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    color: "#007AFF",
  },
});
