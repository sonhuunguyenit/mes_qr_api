import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const SupplierLockDetailSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              height: 52,
              justifyContent: "center",
            },
          ]}
        >
          <Skeleton width="60%" height={18} radius={4} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 0,
  },
  card: {
    marginBottom: 10,
  },
});

export default SupplierLockDetailSkeleton;
