import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container, Icon, Linear, Row, Spacer, Text } from "~/common";
import { useHome } from "../hooks/useHome";
import { Module } from "../types";
import { useTheme } from "~/hooks/useTheme";
import { goPO, goPR } from "~/utils/navigate";
import { CollapseMenu } from "../components/CollapseMenu";
import { HomeHeader } from "../components/HomeHeader";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { MenuBlock } from "../components/MenuGrid";
import StringHelper from "~/utils/string";

const Home = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const { modules, totalApproveCount, isLoading, refetch } = useHome();

  const filteredModules = useMemo(() => {
    if (!search) return modules;
    const searchNorm = StringHelper.removeVietnameseTones(search.toLowerCase());

    return modules
      .map((mod) => {
        const modTitleNorm = StringHelper.removeVietnameseTones(
          mod.title.toLowerCase(),
        );

        if (mod.isGroup) {
          const filteredItems = mod.items?.filter((item) => {
            const itemTitleNorm = StringHelper.removeVietnameseTones(
              item.title.toLowerCase(),
            );
            return itemTitleNorm.includes(searchNorm);
          });

          if (
            modTitleNorm.includes(searchNorm) ||
            (filteredItems && filteredItems.length > 0)
          ) {
            return {
              ...mod,
              items: filteredItems,
              forceExpand: true,
            };
          }
          return null;
        }

        return modTitleNorm.includes(searchNorm) ? mod : null;
      })
      .filter((m) => m !== null) as Module[];
  }, [search, modules]);

  const topModules = useMemo(() => {
    return filteredModules.filter((m) => m.id === "PR" || m.id === "PO");
  }, [filteredModules]);

  const groupModules = useMemo(() => {
    return filteredModules.filter((m) => m.id !== "PR" && m.id !== "PO");
  }, [filteredModules]);

  const handlePressModule = (type: string, subType?: string) => {
    const prFamily = [
      "PR",
      "SUPPLIER",
      "CONTRACT_APPENDIX",
      "BUSINESSPLAN",
      "APPROVED_RECOMMEND_PURCHASE",
      "LS",
      "LSS",
      "RUSL",
      "RUSC",
      "SAP_CODE",
    ];
    const poFamily = ["PO", "BID", "CONTRACT", "PAYMENT"];

    if (prFamily.includes(type)) {
      return goPR({ type: subType || type });
    }
    if (poFamily.includes(type)) {
      return goPO({ type: subType || type });
    }

    goPR({ type: subType || type });
  };

  return (
    <Linear>
      <HomeHeader
        totalApproveCount={totalApproveCount}
        onSearch={setSearch}
        searchValue={search}
      />

      <View
        style={{
          flex: 1,
          marginTop: insets.top + 110,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 40,
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        >
          {isLoading && modules.length === 0 ? (
            <HomeSkeleton />
          ) : (
            <>
              {topModules.length > 0 && (
                <View style={styles.topSection}>
                  <Row
                    gap={8}
                    align="center"
                    style={[styles.sectionHeader, { paddingBottom: 0 }]}
                  >
                    <Icon
                      name="zap"
                      type="feather"
                      size={18}
                      color={colors.active}
                    />
                    <Text
                      bold
                      size={15}
                      color={colors.active}
                      style={{ lineHeight: 20 }}
                    >
                      Duyệt nhanh
                    </Text>
                  </Row>
                  <View style={{ paddingTop: 16 }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={[
                        styles.horizontalScroll,
                        { gap: 10 },
                      ]}
                      style={{ overflow: "visible" }}
                    >
                      {topModules.map((mod) => (
                        <MenuBlock
                          key={mod.id}
                          title={mod.title}
                          icon={mod.icon || "grid"}
                          count={mod.count}
                          // iconBackgroundColor={colors.lyellowIcon}
                          // iconColor={colors.yellow}
                          onPress={() => handlePressModule(mod.id)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}

              {groupModules.map((mod: Module) => (
                <CollapseMenu
                  key={mod.id}
                  mod={mod}
                  onPress={(id, subId) => handlePressModule(id, subId)}
                />
              ))}

              {filteredModules.length === 0 && (
                <View style={styles.empty}>
                  <Icon
                    name="search"
                    type="feather"
                    size={48}
                    color={colors.disabled}
                  />
                  <Spacer size={16} />
                  <Text color={colors.label} weight="600" size={16}>
                    Không tìm thấy kết quả
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Linear>
  );
};

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingBottom: 12,
  },
  horizontalScroll: {
    paddingHorizontal: 0,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
});

export default Home;
