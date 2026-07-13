import { Icon } from "@rneui/base";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "~/assets";
import { Row, Spacer, Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { goNotification, goUserInfo } from "~/utils/navigate";

interface HomeHeaderProps {
  totalApproveCount?: number;
  numNotifyNew?: number;
  onSearch?: (text: string) => void;
  searchValue?: string;
  onPressSearch?: () => void;
}

export const HomeHeader = ({
  totalApproveCount = 0,
  numNotifyNew = 0,
  onSearch,
  searchValue,
  onPressSearch,
}: HomeHeaderProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerWrapper,
        {
          paddingTop: insets.top + 5,
          backgroundColor: colors.header as string,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Image
          source={Images.logo}
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
          }}
          resizeMode="contain"
        />

        {/* Perfectly Centered Title */}
        <View style={styles.titleContainer} pointerEvents="none">
          <Text
            size={17}
            weight={"700"}
            color={colors.black}
            style={{
              marginTop: 5,
            }}
          >
            Thông báo duyệt
          </Text>

          <Row gap={5} margin={[2, 0, 0, 5]}>
            <Icon
              name="circle"
              type="material"
              size={5}
              color={colors.title as string}
            />
            <Text size={13} weight={"700"} color={colors.title}>
              Phân quyền duyệt của bạn
            </Text>
          </Row>
        </View>

        <Row gap={10}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goNotification}
            style={[
              styles.notifContainer,
              {
                width: 42,
                height: 42,
                borderRadius: 42,
                backgroundColor: colors.lgrayBg as string,
              },
            ]}
          >
            <Icon
              name="notifications-outline"
              type="ionicon"
              size={24}
              color={colors.title as string}
            />
            {numNotifyNew > 0 && (
              <View
                style={[
                  styles.badge,
                  {
                    borderColor: colors.white as string,
                    backgroundColor: colors.badgeRed as string,
                  },
                ]}
              >
                <Text
                  size={10}
                  weight={"700"}
                  color={colors.white}
                  style={{ lineHeight: 14 }}
                >
                  {numNotifyNew > 99 ? "99+" : numNotifyNew}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Info */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goUserInfo}
            style={[
              styles.notifContainer,
              {
                width: 45,
                height: 45,
                borderRadius: 45,
                backgroundColor: colors.lgrayBg as string,
              },
            ]}
          >
            <Icon
              name="user"
              type="feather"
              size={22}
              color={colors.title as string}
            />
          </TouchableOpacity>
        </Row>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TouchableOpacity
          activeOpacity={onPressSearch ? 0.9 : 1}
          onPress={onPressSearch}
          disabled={!onPressSearch}
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
            placeholder="Tìm kiếm thông báo duyệt..."
            placeholderTextColor={colors.label as string}
            value={searchValue}
            onChangeText={onSearch}
            editable={!onPressSearch}
            pointerEvents={onPressSearch ? "none" : "auto"}
            style={{
              color: colors.title as string,
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
              color={colors.active as string}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingBottom: 8,
    marginBottom: 10,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  headerContent: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  notifContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  badge: {
    position: "absolute",
    top: 1,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  searchBarWrapper: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 8,
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
  filterIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
