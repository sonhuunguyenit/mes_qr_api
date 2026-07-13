import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, MainItemInfo } from "~/components";
import { Button, Card, Divider, Icon, Row, Spacer, Tag, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { BidRateItemData } from "~/services/bidRate/bidRate.type";
import globalStyle from "~/styles/global-style";
import BidRateItemSkeleton from "./BidRateItemSkeleton";

import { BID_STATUS } from "~/enums";

interface BidRateItemProps {
  item: BidRateItemData;
  onPress?: () => void;
  loading?: boolean;
}

const BidRateItem = ({ item, onPress, loading }: BidRateItemProps) => {
  const { colors } = useTheme();

  if (loading) return <BidRateItemSkeleton />;

  const canSelectWinningSupplier =
    item.status === BID_STATUS.EVALUATION_COMPLETED
      ? (item as any).isMemeberApproved === true
      : item.status === BID_STATUS.SUPPLIER_SELECTED ||
        item.status === BID_STATUS.APPROVING_RESULT ||
        item.status === BID_STATUS.NEGOTIATION_COMPLETED;

  return (
    <Card shadow style={globalStyle.item} onPress={onPress}>
      <Row justify="space-between" align="center">
        <View style={globalStyle.tagRow}>
          <Badge
            label=""
            value={item.statusName || item.status}
            color={item.statusColor || colors.active}
            backgroundColor={item.statusBgColor}
          />
        </View>
      </Row>

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
          value={item.companyName || item.companyCode || ""}
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

        {item.submitEndDate && (
          <Tag
            icon="clock"
            label="Hết hạn nộp hồ sơ"
            value={moment(item.submitEndDate).format("DD/MM/YYYY HH:mm")}
          />
        )}

        {item.createdAt && (
          <Tag
            icon="clock"
            label="Ngày tạo"
            value={moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
          />
        )}
      </View>

      <Spacer size={5} />
      <Divider />
      {canSelectWinningSupplier && (
        <Row
          justify="flex-end"
          style={{
            marginTop: 5,
            backgroundColor: `${colors.active as string}15`,
            borderWidth: 0,
            height: 35,
            paddingRight: 10,
          }}
          gap={5}
        >
          <TouchableOpacity
            onPress={onPress}
            style={{
              padding: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.blue500,
                paddingBottom: 0.5,
              }}
            >
              <Text
                style={{
                  color: colors.blue500,
                }}
              >
                Chọn NCC Thắng thầu
              </Text>
            </View>
          </TouchableOpacity>

          <Icon
            type="ionicon"
            name="send"
            color={colors.blue500}
            size={19}
          ></Icon>
        </Row>
      )}
    </Card>
  );
};

export default React.memo(BidRateItem);
