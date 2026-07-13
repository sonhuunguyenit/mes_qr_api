import React from "react";
import { StyleSheet, View } from "react-native";
import { Row, Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const SupplierLawDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {[1, 2, 3, 4, 5].map((i) => (
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
                minHeight: 52,
                justifyContent: "center",
              },
            ]}
          >
            <Row justify="space-between" align="center">
              <View style={{ gap: 8 }}>
                <Skeleton width={180} height={18} radius={4} />
              </View>
              <Skeleton width={20} height={20} radius={4} />
            </Row>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SupplierLawDetailSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 15,
    paddingHorizontal: 5,
  },
  card: {
    marginBottom: 10,
  },
});
