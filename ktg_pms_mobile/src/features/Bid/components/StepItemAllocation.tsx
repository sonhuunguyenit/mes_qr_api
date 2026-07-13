import React from "react";
import { View } from "react-native";
import {
  Card,
  Collapse,
  Column,
  SelectPicker,
  Tag,
  Text,
  Spacer,
} from "~/common";
import { useTheme } from "~/hooks/useTheme";
import globalStyle from "~/styles/global-style";
import moment from "moment";

interface ItemAllocationProps {
  mutableDetail: any[];
  lstSupplierChoose: any[];
  assignSupplier: (itemIndex: number, supplierId: string | null) => void;
}

export const StepItemAllocation = ({
  mutableDetail,
  lstSupplierChoose,
  assignSupplier,
}: ItemAllocationProps) => {
  const { colors } = useTheme();

  return (
    <Collapse
      title="Phân bổ nhà cung cấp cho từng hạng mục"
      defaultExpanded={true}
      containerStyle={{
        paddingBottom: 0,
      }}
      headerStyle={{
        borderBottomWidth: 0.75,
        borderColor: colors.border,
      }}
    >
      <Column gap={10} align="stretch" style={{ paddingHorizontal: 5 }}>
        {mutableDetail.map((item: any, index: number) => (
          <Card key={index} shadow style={globalStyle.item}>
            <Column gap={10} align="stretch">
              {/* Name/ShortText */}
              <Text bold size={15} color={colors.active}>
                {item.name ||
                  item.shortText ||
                  `Item ${item.itemNo || index + 1}`}
              </Text>

              {/* Tag list - giống style Item List */}
              <View style={globalStyle.tagRow}>
                {item.plantName ? (
                  <Tag icon="home" label="Nhà máy" value={item.plantName} />
                ) : null}
                {item.itemNo ? (
                  <Tag icon="hash" label="Item Line" value={item.itemNo} />
                ) : null}
                {item.materialCode ? (
                  <Tag icon="box" label="Mã vật tư" value={item.materialCode} />
                ) : null}
                {item.shortText ? (
                  <Tag
                    icon="file-text"
                    label="Short text"
                    value={item.shortText}
                    limit={40}
                  />
                ) : null}
                {item.deliveryDate ? (
                  <Tag
                    icon="clock"
                    label="Thời gian giao"
                    value={moment(item.deliveryDate).format("DD/MM/YYYY")}
                  />
                ) : null}
                <Tag
                  icon="shopping-cart"
                  label="SL"
                  value={`${Number(
                    item.quantity ?? item.number ?? 0,
                  ).toLocaleString("en-US")} ${item.unitCode || ""}`}
                />
              </View>

              <Spacer size={4} />

              {/* Chọn NCC cho dòng này — sử dụng SelectPicker popup */}
              <SelectPicker
                placeholder="Chọn nhà cung cấp..."
                listSelection={lstSupplierChoose}
                valueKey="supplierId"
                labelKeys={["supplierCode", "supplierName"]}
                value={item.supplierId}
                onSelect={(selectedSupplier) => {
                  assignSupplier(index, selectedSupplier?.supplierId || null);
                }}
              />
            </Column>
          </Card>
        ))}
      </Column>
    </Collapse>
  );
};
