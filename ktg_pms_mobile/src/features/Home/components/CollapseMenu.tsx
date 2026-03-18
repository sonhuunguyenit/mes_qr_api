import React from "react";
import { StyleSheet, View } from "react-native";
import { Collapse, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { Module, ModuleItem } from "../types";
import { MenuBlock, MenuGrid } from "./MenuGrid";

interface CollapseMenuProps {
  mod: Module;
  onPress: (id: string, subId?: string) => void;
}

export const CollapseItem = ({ item }: { item: ModuleItem }) => {
  const { colors } = useTheme();
  return (
    <MenuBlock
      title={item.title}
      icon={item.icon || "circle"}
      count={item.count}
      columns={3}
      // iconBackgroundColor={colors.lyellowIcon}
      // iconColor={colors.yellow}
    />
  );
};

export const CollapseMenu = ({ mod, onPress }: CollapseMenuProps) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <Collapse
        title={mod.title}
        titleColor={colors.active}
        icon={{
          name: mod.icon || "grid",
          type: (mod.iconType as any) || "feather",
          size: 18,
        }}
        iconColor={colors.active}
        collapsible
        expanded={mod.forceExpand}
        style={{ paddingHorizontal: 10, paddingVertical: 16 }}
        headerStyle={{ paddingBottom: 12 }}
        noHeaderPadding
        noContentPadding
      >
        <View style={{ paddingTop: 4 }}>
          <MenuGrid marginTop={0}>
            {mod.items?.map((item, index) => (
              <View key={index} onTouchEnd={() => onPress(mod.id, item.type)}>
                <CollapseItem item={item} />
              </View>
            ))}
            {(!mod.items || mod.items.length === 0) && (
              <View style={styles.empty}>
                <Text size={13} color={colors.placeholder}>
                  Không có dữ liệu
                </Text>
              </View>
            )}
          </MenuGrid>
        </View>
      </Collapse>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  headerBadge: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  empty: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
});
