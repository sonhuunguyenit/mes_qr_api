import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/base";
import { Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "~/assets";

interface HomeHeaderProps {
  totalApproveCount?: number;
  onSearch?: (text: string) => void;
  searchValue?: string;
}

export const HomeHeader = ({
  totalApproveCount = 0,
  onSearch,
  searchValue,
}: HomeHeaderProps) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerWrapper}>
      <View
        style={[
          styles.headerBg,
          {
            backgroundColor: "#fff394",
            paddingTop: insets.top + spacing.xs,
            paddingBottom: 28,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* Perfectly Centered Title */}
          <View style={styles.titleContainer} pointerEvents="none">
            <Text style={styles.titleText} color={colors.title}>
              Thông báo duyệt
            </Text>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={Images.splashIcon}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Notification Account */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.notifContainer}
          >
            <Icon
              name="notifications-outline"
              type="ionicon"
              size={24}
              color={colors.title}
            />
            {totalApproveCount > 0 && (
              <View style={[styles.badge, { borderColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.searchBar, { backgroundColor: colors.white }]}
        >
          <Icon type="feather" name="search" size={18} color="#94A3B8" />
          <Spacer horizontal size={12} />
          <Text style={{ color: "#94A3B8", fontSize: 13, flex: 1 }}>
            {searchValue || "Tìm kiếm thông báo duyệt ..."}
          </Text>
          <View style={styles.filterIcon}>
            <Icon
              type="feather"
              name="sliders"
              size={16}
              color={colors.active}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingBottom: 10,
  },
  headerBg: {
    width: "100%",
    paddingHorizontal: 10,
  },
  headerContent: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  logoContainer: {
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  notifContainer: {
    zIndex: 1,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
  },
  searchBarWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: -26,
    paddingHorizontal: 10,
  },
  searchBar: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
