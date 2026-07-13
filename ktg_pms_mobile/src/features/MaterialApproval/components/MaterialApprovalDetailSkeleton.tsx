import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Row, Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";

const MaterialApprovalDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 8 Tab Skeletons (rendered in horizontal scroll to prevent overflow) */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <Row justify="flex-start" style={{ gap: 20 }}>
            {[100, 110, 150, 90, 80, 80, 110, 90].map((width, idx) => (
              <View key={idx} style={styles.tabItem}>
                <Skeleton width={width} height={20} radius={4} />
              </View>
            ))}
          </Row>
        </ScrollView>
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
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 5,
    paddingHorizontal: 5,
    gap: 10,
  },
  card: {
    marginBottom: 0,
  },
});

export default MaterialApprovalDetailSkeleton;
