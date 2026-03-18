import React from "react";
import { StyleSheet, View } from "react-native";
import { Row, Card, Spacer, Skeleton } from "~/common";

const PRItemSkeleton = () => {
  return (
    <Card style={styles.card} padding={16}>
      {/* 1. Status Tag Row */}
      <View style={styles.tagRow}>
        <Skeleton width={120} height={24} radius={30} />
        <Skeleton width={120} height={24} radius={30} />
      </View>

      <Spacer size={12} />

      {/* 2. Identifier Section */}
      <Row align="center">
        <Skeleton width={28} height={28} radius={8} />
        <Spacer size={10} horizontal />
        <Skeleton width={120} height={18} />
      </Row>

      <Spacer size={12} />

      {/* 3. Consolidated Metadata Tag Cloud */}
      <View style={styles.tagRow}>
        {/* Uses & External Mat Group (Full Width Skeletons) */}
        <Skeleton width="100%" height={32} radius={100} />
        <Skeleton width="100%" height={32} radius={100} />

        {/* Other Chips */}
        <Skeleton width={100} height={24} radius={100} />
        <Skeleton width={70} height={24} radius={100} />
        <Skeleton width={60} height={24} radius={100} />
        <Skeleton width={140} height={24} radius={100} />
        <Skeleton width={150} height={24} radius={100} />
        <Skeleton width={100} height={24} radius={100} />
        <Skeleton width={80} height={24} radius={100} />
      </View>

      <Spacer size={12} />
      <View style={styles.divider} />
      <Spacer size={12} />

      {/* 4. Values Section */}
      <Row justify="space-between">
        <View>
          <Skeleton width={80} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={110} height={16} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Skeleton width={80} height={10} style={{ marginBottom: 4 }} />
          <Skeleton width={110} height={16} />
        </View>
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderColor: "#F1F5F9",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});

export default PRItemSkeleton;
