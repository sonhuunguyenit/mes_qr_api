import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge, MainItemInfo } from "~/components";
import { Card, Row, Spacer, Tag, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { BidItemData } from "~/services/bid/bid.type";
import globalStyle from "~/styles/global-style";
import BidItemSkeleton from "./BidItemSkeleton";

interface BidItemProps {
  item: BidItemData;
  onPress?: () => void;
  loading?: boolean;
}

const BidItem = ({ item, onPress, loading }: BidItemProps) => {
  const { colors } = useTheme();

  if (loading) return <BidItemSkeleton />;

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      <View style={globalStyle.tagRow}>
        <Badge
          label="Trạng thái"
          value={item.statusName || item.status}
          color={item.statusColor || colors.active}
          backgroundColor={item.statusBgColor}
        />

        {item.submitEndDate && (
          <Tag
            icon="clock"
            label="Hết hạn"
            value={moment(item.submitEndDate).format("DD/MM/YYYY HH:mm")}
          />
        )}
      </View>

      <Spacer size={12} />

      <Row align="center" justify="space-between">
        <MainItemInfo
          title={`${item.code} ${item.name ? `- ${item.name}` : ""}`}
        />
      </Row>

      <Spacer size={12} />

      <View style={globalStyle.tagRow}>
        <Tag
          icon="home"
          label=""
          value={item.companyName || item.plantName || ""}
        />

        <Tag
          icon="file-text"
          label="Nguồn tham chiếu"
          value={item.referenceName || ""}
        />
        <Tag icon="user" label="PT kỹ thuật" value={item.techName || ""} />
        <Tag icon="user" label="PT mua hàng" value={item.tradeName || ""} />
        <Tag
          icon="users"
          label="Hội đồng xét thầu"
          value={item.lstMemmberName || ""}
          limit={50}
        />
        <Tag
          icon="folder"
          label="Dự án"
          value={item.projectName || ""}
          fullWidth
        />
        <Tag
          icon="file-text"
          label="Hình thức bảo lãnh"
          value={item.bidGuaranteeName || ""}
        />
        <Tag icon="tag" label="Mục đích" value={item.purposeName || ""} />
        <Tag icon="tag" label="Hình thức" value={item.bidTypeName || ""} />
        {item.acceptEndDate && (
          <Tag
            icon="clock"
            label="Ngày xác nhận"
            value={moment(item.acceptEndDate).format("DD/MM/YYYY HH:mm")}
          />
        )}

        <Tag
          icon="clock"
          label="Ngày tạo"
          value={moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
        />
      </View>
    </Card>
  );
};

export default BidItem;
