import React from "react";
import { View } from "react-native";
import { Card, Row, Spacer, Skeleton } from "~/common";
import globalStyle from "~/styles/global-style";

const ContractItemSkeleton = () => {
  return (
    <Card style={globalStyle.item}>
      <Row justify="space-between">
        <Skeleton width={120} height={20} radius={20} />
        <Skeleton width={120} height={20} radius={20} />
      </Row>

      <Spacer size={12} />

      <Row align="center">
        <Skeleton width={28} height={20} radius={10} />
        <Spacer size={10} horizontal />
        <Skeleton width="100%" height={20} />
      </Row>

      <Spacer size={12} />

      <View style={globalStyle.tagRow}>
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
        <Skeleton width="95%" height={24} radius={20} />
        <Skeleton width="75%" height={24} radius={20} />
      </View>
    </Card>
  );
};

export default ContractItemSkeleton;
