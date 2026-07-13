import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Collapse, Divider } from "~/common";
import { Module } from "../types";
import { MenuGrid } from "./MenuGrid";
import { CollapseItem } from "./CollapseItem";
import { useTheme } from "~/hooks/useTheme";

interface CollapseMenuProps {
  mod: Module;
  onPress: (id: string, subId?: string) => void;
}

export const CollapseMenu = ({ mod, onPress }: CollapseMenuProps) => {
  const { colors } = useTheme();

  const CollapseMenuStyle = useMemo(
    () => ({
      titleStyle: {
        fontSize: 14,
        fontWeight: "600" as const,
        color: colors.slate700 as string,
      },
      headerStyle: {
        borderBottomWidth: 0.75,
        borderColor: colors.border as string,
      },
      icon: {
        name: "grid",
        type: "entypo",
        size: 17,
        color: colors.slate700 as string,
      },
      containerStyle: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
    [colors],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card as string,
          shadowColor: colors.black as string,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border as string,
        }}
      >
        <Collapse
          defaultExpanded={true}
          title={mod.title}
          collapsible
          expanded={mod.forceExpand}
          {...CollapseMenuStyle}
        >
          <MenuGrid>
            {mod.items?.map((item, index) => (
              <CollapseItem
                key={index}
                item={item}
                index={index}
                total={mod.items?.length || 0}
                onPress={() => onPress(mod.id, item.type)}
              />
            ))}
          </MenuGrid>

          <Divider width={0.75} color={colors.border as string} />

          <View
            style={{
              alignSelf: "center",
              height: 20,
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: 40,
                height: 8,
                backgroundColor: colors.border as string,
                borderRadius: 50,
              }}
            >
              <View
                style={{
                  width: 23,
                  height: 8,
                  backgroundColor: "#ffc325", // Keeping specific decorative color
                  borderRadius: 50,
                }}
              ></View>
            </View>
          </View>
        </Collapse>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  empty: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
});
