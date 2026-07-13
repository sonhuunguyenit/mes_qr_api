import React from "react";
import { StyleSheet, View } from "react-native";
import { Row, Card, Spacer, Skeleton } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import globalStyle from "~/styles/global-style";

const MaterialApprovalItemSkeleton = () => {
  const { colors } = useTheme();

  return (
    <Card style={globalStyle.item}>
      {/* 1. Status Tag Row */}
      <Row justify="space-between">
        <Skeleton width={120} height={20} radius={20} />
        <Skeleton width={120} height={20} radius={20} />
      </Row>

      <Spacer size={12} />

      {/* 2. Identifier Section */}
      <Row align="center">
        <Skeleton width={140} height={22} radius={4} />
      </Row>

      <Spacer size={8} />

      {/* 3. Name Text Skeleton */}
      <Skeleton width="90%" height={16} radius={4} />

      <Spacer size={12} />

      {/* 4. Metadata Tag Cloud */}
      <View style={globalStyle.tagRow}>
        <Skeleton width="45%" height={20} radius={20} />
        <Skeleton width="48%" height={20} radius={20} />
        <Skeleton width="40%" height={20} radius={20} />
        <Skeleton width="50%" height={20} radius={20} />
        <Skeleton width="60%" height={20} radius={20} />
        <Skeleton width="100%" height={20} radius={20} />
        <Skeleton width="100%" height={20} radius={20} />
        <Skeleton width="100%" height={20} radius={20} />
      </View>

      <Spacer size={12} />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Spacer size={12} />

      {/* 5. Write Block Tags Skeleton */}
      <Skeleton width="50%" height={14} radius={4} />
      <Spacer size={8} />

      <Row gap={6} style={{ flexWrap: "wrap" }}>
        <Skeleton width={45} height={18} radius={4} />
        <Skeleton width={45} height={18} radius={4} />
        <Skeleton width={45} height={18} radius={4} />
        <Skeleton width={45} height={18} radius={4} />
        <Skeleton width={45} height={18} radius={4} />
        <Skeleton width={45} height={18} radius={4} />
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});

export default MaterialApprovalItemSkeleton;
