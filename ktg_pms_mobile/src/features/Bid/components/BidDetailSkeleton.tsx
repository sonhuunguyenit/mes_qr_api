import React from "react";
import { StyleSheet, View } from "react-native";
import { Row, Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const BidDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[styles.tabsContainer, { backgroundColor: colors.card as string, borderBottomColor: colors.slate100 as string }]}
      >
        <Row justify="flex-start" style={styles.tabs}>
          <View style={styles.tabItem}>
            <Skeleton width={"50%"} height={20} radius={4} />
          </View>
          <View style={styles.tabItem}>
            <Skeleton width={"50%"} height={20} radius={4} />
          </View>
        </Row>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  tabs: {
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  card: {
    marginBottom: 10,
  },
});

export default BidDetailSkeleton;
