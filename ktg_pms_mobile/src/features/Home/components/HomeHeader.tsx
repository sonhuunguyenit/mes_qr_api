import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon } from "@rneui/base";
import { Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "~/assets";
import { goNotification, goUserInfo } from "~/utils/navigate";

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
            // backgroundColor: "#fff394",
            backgroundColor: colors.white,
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

          <Row gap={10}>
            {/* Notification Account */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goNotification}
              style={styles.notifContainer}
            >
              <Icon
                name="notifications-outline"
                type="ionicon"
                size={26}
                color={colors.title}
              />
              {totalApproveCount > 0 && (
                <View style={[styles.badge, { borderColor: colors.white }]} />
              )}
            </TouchableOpacity>

            {/* User Info */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goUserInfo}
              style={styles.notifContainer}
            >
              <Icon name="user" type="feather" size={25} color={colors.title} />
            </TouchableOpacity>
          </Row>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, { backgroundColor: colors.white }]}>
          <Icon type="feather" name="search" size={18} color="#94A3B8" />
          <Spacer horizontal size={12} />
          <TextInput
            placeholder="Tìm kiếm thông báo duyệt..."
            placeholderTextColor="#94A3B8"
            value={searchValue}
            onChangeText={onSearch}
            style={{
              color: colors.title,
              fontSize: 14,
              flex: 1,
              height: "100%",
              paddingVertical: 0,
            }}
          />
          <View style={styles.filterIcon}>
            <Icon
              type="feather"
              name="sliders"
              size={16}
              color={colors.active}
            />
          </View>
        </View>
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
    fontSize: 18,
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
