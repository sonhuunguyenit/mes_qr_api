import React from "react";
import { StyleSheet, View } from "react-native";
import { Row, Card, Spacer, Skeleton } from "~/common";

const POItemSkeleton = () => {
  return (
    <Card shadow={false} style={styles.card} padding={16}>
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
        <Skeleton width={100} height={20} />
        <Spacer size={10} horizontal />
        <Skeleton width={80} height={20} radius={6} />
      </Row>

      <Spacer size={12} />

      {/* 3. Metadata Tag Cloud */}
      <View style={styles.tagRow}>
        {/* NCC (Full Width) */}
        <Skeleton width="100%" height={32} radius={100} />

        {/* Chips */}
        <Skeleton width={140} height={24} radius={100} />

        {/* Reference Doc (Full Width) */}
        <Skeleton width="100%" height={32} radius={100} />

        <Skeleton width={100} height={24} radius={100} />

        {/* Company (Full Width) */}
        <Skeleton width="100%" height={32} radius={100} />

        <Skeleton width={120} height={24} radius={100} />
        <Skeleton width={90} height={24} radius={100} />
        <Skeleton width={70} height={24} radius={100} />
      </View>

      <Spacer size={12} />
      <View style={styles.divider} />
      <Spacer size={12} />

      {/* 4. Total Value Section */}
      <Row justify="space-between" align="center">
        <Skeleton width={80} height={12} />
        <Row align="center">
          <Skeleton width={100} height={20} />
          <Spacer size={4} horizontal />
          <Skeleton width={30} height={14} />
        </Row>
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
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

export default POItemSkeleton;
