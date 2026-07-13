import { Icon } from "@rneui/base";
import React from "react";
import {
  ColorValue,
  Dimensions,
  DimensionValue,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface MenuBlockProps {
  title: string;
  icon: string;
  iconType?: string;
  count?: number;
  onPress?: () => void;
  columns?: number;
  iconColor?: ColorValue;
  backgroundColor?: ColorValue;
  iconContainerColor?: ColorValue;
  iconSize?: number;
  index?: number;
  total?: number;
}

export const MenuBlock = ({
  title,
  icon,
  iconType = "ionicon",
  count,
  onPress,
  columns = 4,
  iconColor,
  backgroundColor,
  iconContainerColor,
  iconSize = 32,
  index = 0,
  total = 0,
}: MenuBlockProps) => {
  const { colors } = useTheme();
  const itemWidth = `${100 / columns}%`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.block,
        {
          width: itemWidth as DimensionValue,
          borderColor: colors.border,
          // borderColor: "#64748B",
          borderRightWidth: (index + 1) % columns === 0 ? 0 : 0.75,
          borderBottomWidth:
            index >= total - (total % columns || columns) ? 0 : 0.75,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: "#fff7dd",
          height: 50,
          width: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 14,
          zIndex: 1,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "#ffc325",
          // borderColor: "#64748B",
          //           #FFC107 hoặc #FFB703	Màu vàng đậm đặc trưng của hệ thống (Theme color).
          // Nền bo góc của Icon	#FFF3CD hoặc #FFF7E6
          //           fcf6cd

          // fcb911

          // fdae0a

          // FFF7E6
        }}
      >
        <Icon
          name={icon}
          type={iconType}
          size={iconSize}
          color={"#ffc325"} // iconColor || "#F29924" "#64748B" 414B5A F38A21 F38A21
        />

        {/* {count !== undefined && count > 0 && (
          <View
            style={[styles.badge, { backgroundColor: colors.red, zIndex: 1 }]}
          >
            <Text size={12} weight="700" color={colors.white}>
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        )} */}
      </View>

      <Spacer size={6} />

      <Text
        size={12}
        weight="500"
        color={colors.slate700}
        numberOfLines={2}
        style={[styles.title, { zIndex: 1 }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const MenuGrid = ({
  children,
  marginTop = 0,
}: {
  children: React.ReactNode;
  marginTop?: number;
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.grid,
        {
          marginTop,
          backgroundColor: colors.card,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    // borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    overflow: "hidden",
  },
  block: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 10,
  },
  iconContainer: {
    width: "60%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 10,
  },
});
