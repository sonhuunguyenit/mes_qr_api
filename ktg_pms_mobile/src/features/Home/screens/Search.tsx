import { Icon } from "@rneui/base";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Empty, Header, Linear, Row, Spacer, Text } from "~/common";
import { Status } from "~/components";
import { useModal } from "~/hooks/useModal";
import { useTheme } from "~/hooks/useTheme";
import {
  goBid,
  goBidRate,
  goContract,
  goPO,
  goPR,
  goReservationDemand,
  goReservationMaintenance,
  goSupplierCapacity,
  goSupplierLaw,
  goSupplierLock,
  goSupplierLockService,
  goSupplierPotential,
  goSupplierSap,
  goMaterialApproval,
} from "~/utils/navigate";
import StringHelper from "~/utils/string";
import { MODULE_TYPE_CONFIG } from "../constants";
import { useHome } from "../hooks/useHome";
import { ApproveFlowCode, ModuleItem } from "../types";

const Search = () => {
  const { colors } = useTheme();
  const { show, hide } = useModal();
  const { modules } = useHome();
  const [search, setSearch] = useState("");

  // Flatten the modules and items to form a list of leaf items
  const allItems = useMemo(() => {
    const list: (ModuleItem & { parentTitle?: string })[] = [];
    modules.forEach((mod) => {
      if (mod.isGroup && mod.items) {
        mod.items.forEach((item) => {
          list.push({
            ...item,
            parentTitle: mod.title,
          });
        });
      } else {
        list.push({
          title: mod.title,
          subtitle: mod.subtitle,
          count: mod.count,
          icon: mod.icon,
          type: mod.type || mod.id,
          iconType: mod.iconType,
          iconSize: mod.iconSize,
          iconContainerColor: mod.iconContainerColor,
          iconColor: mod.iconColor,
          permissionCode: mod.permissionCode,
        });
      }
    });
    return list;
  }, [modules]);

  // Filter based on search query
  const filteredItems = useMemo(() => {
    if (!search) return allItems;
    const searchNorm = StringHelper.removeVietnameseTones(search.toLowerCase());

    return allItems.filter((item) => {
      const titleNorm = StringHelper.removeVietnameseTones(
        item.title.toLowerCase(),
      );
      const config = MODULE_TYPE_CONFIG[item.type || ""];
      const subtitle = item.subtitle || config?.subtitle || "";
      const subtitleNorm = StringHelper.removeVietnameseTones(
        subtitle.toLowerCase(),
      );

      return (
        titleNorm.includes(searchNorm) || subtitleNorm.includes(searchNorm)
      );
    });
  }, [search, allItems]);

  const getModuleDescription = (type?: string, subtitle?: string) => {
    if (subtitle) return subtitle;
    if (!type) return "";
    return MODULE_TYPE_CONFIG[type]?.subtitle || "";
  };

  const handlePressModule = (type: string, params?: any) => {
    switch (type) {
      case ApproveFlowCode.SAP_CODE:
        return goSupplierSap();
      case ApproveFlowCode.SUPPLIER_POTENTIAL:
        return goSupplierPotential();
      case ApproveFlowCode.LSS:
        return goSupplierLockService(params);
      case ApproveFlowCode.RUSL:
        return goSupplierLaw();
      case ApproveFlowCode.RUSC:
        return goSupplierCapacity();
      case ApproveFlowCode.LS:
        return goSupplierLock({ type: "LS" });
      case ApproveFlowCode.USAGE_DEMAND:
      case ApproveFlowCode.USAGE_DEMAND_SUB:
        return goReservationDemand();
      case ApproveFlowCode.REPAIR_DEMAND:
        return goReservationMaintenance();
      case ApproveFlowCode.PR:
        return goPR();
      case ApproveFlowCode.PO:
        return goPO();
      case ApproveFlowCode.BID:
        return goBid(params);
      case ApproveFlowCode.CONTRACT:
        return goContract(params);
      case ApproveFlowCode.SUPPLIER_WIN_BID:
        return goBidRate(params);
      case ApproveFlowCode.MATERIAL_APPROVAL:
        return goMaterialApproval(params);

      default:
        show({
          type: "popup",
          style: {
            width: "75%",
          },
          component: (
            <Status
              type="info"
              title="Develop"
              message="Tính năng đang được phát triển"
            />
          ),
          onConfirm: hide,
        });
        break;
    }
  };

  const renderItem = ({
    item,
  }: {
    item: ModuleItem & { parentTitle?: string };
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePressModule(item.type || "")}
        style={[
          styles.itemWrapper,
          {
            backgroundColor: colors.card as string,
            borderColor: colors.border as string,
          },
        ]}
      >
        <Row align="center" justify="space-between" style={{ flex: 1 }}>
          <Row align="center" style={{ flex: 1 }}>
            {/* Left Icon Container */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: "#fff7dd",
                  borderColor: "#ffc325",
                },
              ]}
            >
              <Icon
                name={item.icon || "file-text"}
                type={item.iconType || "material-community"}
                size={item.iconSize ? item.iconSize - 6 : 22}
                color="#ffc325"
              />
            </View>
            <Spacer horizontal size={12} />

            {/* Title & Count Badge */}
            <Row align="center" gap={6}>
              <Text size={15} weight="600" color={colors.title}>
                {item.title}
              </Text>
              {item.count !== undefined && item.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    { backgroundColor: colors.badgeRed as string },
                  ]}
                >
                  <Text size={10} weight="700" color={colors.white}>
                    {item.count}
                  </Text>
                </View>
              )}
            </Row>
          </Row>
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <Linear>
      <Header
        title="Tìm kiếm chức năng"
        subTitle="Chức năng theo phân quyền"
        showBack={true}
      />

      <View style={styles.container}>
        {/* Search Input Bar */}
        <View style={styles.searchBarWrapper}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.card as string,
                borderColor: colors.border as string,
              },
            ]}
          >
            <Icon
              type="feather"
              name="search"
              size={18}
              color={colors.label as string}
            />
            <Spacer horizontal size={12} />
            <TextInput
              placeholder="Tìm kiếm tên chức năng..."
              placeholderTextColor={colors.label as string}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.input,
                {
                  color: colors.title as string,
                },
              ]}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Icon
                  type="feather"
                  name="x"
                  size={16}
                  color={colors.label as string}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {filteredItems.length === 0 ? (
          <Empty
            title="Không tìm thấy chức năng"
            description="Vui lòng kiểm tra lại từ khóa tìm kiếm"
          />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `${item.type}_${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Linear>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchBarWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 5,
  },
  searchBar: {
    width: "100%",
    height: 50,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});

export default Search;
