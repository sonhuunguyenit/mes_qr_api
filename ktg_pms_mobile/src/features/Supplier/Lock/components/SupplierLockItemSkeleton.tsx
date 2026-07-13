import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Row, Skeleton, Spacer } from "~/common";
import globalStyle from "~/styles/global-style";

import { useTheme } from "~/hooks/useTheme";

const SupplierLockItemSkeleton = () => {
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
        <Skeleton width={28} height={20} radius={10} />
        <Spacer size={10} horizontal />
        <Skeleton width="100%" height={20} />
      </Row>

      <Spacer size={12} />

      {/* 3. Consolidated Metadata Tag Cloud */}
      <View style={globalStyle.tagRow}>
        {/* Uses & External Mat Group (Full Width Skeletons) */}
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
      </View>

      <Spacer size={12} />
      <View style={styles.divider} />
      <Spacer size={12} />

      {/* 4. Values Section */}
      <Row justify="space-between">
        <Skeleton width={120} height={20} radius={20} />
        <Skeleton width={120} height={20} radius={20} />
      </Row>
    </Card>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});

export default SupplierLockItemSkeleton;
