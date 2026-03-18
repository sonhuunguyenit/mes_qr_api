import { Icon } from "@rneui/base";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Images } from "~/assets";
import { Input } from "~/common";
import { useTheme } from "~/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { ROUTE_KEYS } from "~/constants/route";

type OnInput = {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
};

type Props = {
  // Container
  style?: ViewStyle;
  backgroundColor?: string;

  // Left
  leftSide?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;

  // Center
  title?: string;
  subTitle?: string;
  centerContent?: React.ReactNode;

  // Right
  rightSide?: React.ReactNode;
  showNotification?: boolean;
  hasNotification?: boolean;
  onNotification?: () => void;

  // Search
  showSearch?: boolean;
  searchMode?: "input" | "button";
  onInput?: OnInput;
  hasFilter?: boolean;
  onFilter?: () => void;
};

const Header = ({
  style,
  backgroundColor,

  leftSide,
  showBack = false,
  onBack,

  title,
  subTitle,
  centerContent,

  rightSide,
  showNotification = false,
  hasNotification = false,
  onNotification,

  showSearch = false,
  searchMode = "button",
  onInput,
  hasFilter,
  onFilter,
}: Props) => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation<any>();

  const handleBack = () => {
    onBack ? onBack() : navigation.goBack();
  };

  const handleNotification = () => {
    onNotification
      ? onNotification()
      : navigation.navigate(ROUTE_KEYS.Notification);
  };

  const renderLeft = () => {
    if (leftSide) return leftSide;
    if (showBack) {
      return (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <Icon
            name="chevron-left"
            type="entypo"
            size={27}
            color={colors.title}
          />
        </TouchableOpacity>
      );
    }
    return (
      <Image
        source={Images.splashIcon}
        style={styles.logo}
        resizeMode="contain"
      />
    );
  };

  const renderCenter = () => {
    if (centerContent) return centerContent;
    if (!title && !subTitle) return null;
    return (
      <>
        {title && (
          <Text
            style={[styles.titleText, { color: colors.title }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subTitle && (
          <Text
            style={[styles.subTitleText, { color: colors.label }]}
            numberOfLines={1}
          >
            {subTitle}
          </Text>
        )}
      </>
    );
  };

  const renderRight = () => {
    if (rightSide) return rightSide;
    if (!showNotification) return null;
    return (
      <TouchableOpacity
        onPress={handleNotification}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <Icon
          name="notifications-outline"
          type="ionicon"
          size={27}
          color={colors.title}
        />
        {hasNotification && <View style={styles.badge} />}
      </TouchableOpacity>
    );
  };

  const renderSearch = () => {
    if (searchMode === "input") {
      return (
        <Input
          placeholder={onInput?.placeholder ?? "Tìm kiếm..."}
          value={onInput?.value}
          onChangeText={onInput?.onChange}
          renderErrorMessage={false}
          leftIcon={
            <Icon name="search" type="feather" size={18} color="#6B7280" />
          }
          rightIcon={
            onFilter ? (
              <TouchableOpacity onPress={onFilter} activeOpacity={0.7}>
                <Icon
                  name="filter"
                  type="feather"
                  size={18}
                  color={hasFilter ? colors.primary : "#6B7280"}
                />
              </TouchableOpacity>
            ) : undefined
          }
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          inputStyle={[styles.inputText, { color: colors.title }]}
          leftIconContainerStyle={styles.leftIconContainer}
          rightIconContainerStyle={styles.rightIconContainer}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={onFilter}
        activeOpacity={0.7}
        style={[styles.fakeInput, { backgroundColor: colors.white }]}
      >
        <View style={styles.fakeInputContent}>
          <Icon name="search" type="feather" size={18} color="#6B7280" />
          <Text style={styles.fakeInputPlaceholder}>
            {onInput?.placeholder ?? "Tìm kiếm..."}
          </Text>
        </View>
        {onFilter && (
          <Icon name="sliders" type="feather" size={16} color={colors.active} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: spacing.xs,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
          borderRadius: radius.card,
          backgroundColor: backgroundColor ?? colors.primary,
        },
        style,
      ]}
    >
      {/* Left/Right dùng flex, center dùng absoluteFill để title luôn center thật sự */}
      <View style={styles.header}>
        <View style={styles.leftSection}>{renderLeft()}</View>

        <View style={styles.centerSection} pointerEvents="none">
          {renderCenter()}
        </View>

        <View style={styles.rightSection}>{renderRight()}</View>
      </View>

      {showSearch && <View style={styles.searchWrapper}>{renderSearch()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },

  // Header row
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 1,
  },
  // absoluteFill giúp title không bị lệch dù left/right khác chiều rộng
  centerSection: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 1,
  },

  // Logo & icons
  logo: {
    width: 100,
    height: 40,
  },
  iconButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#FF4D4F",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  // Title
  titleText: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  subTitleText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },

  // Search
  searchWrapper: {
    marginTop: 4,
  },
  fakeInput: {
    height: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  fakeInputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fakeInputPlaceholder: {
    fontSize: 14,
    color: "#6B7280",
  },
  inputContainer: {
    paddingHorizontal: 10,
    height: 42,
  },
  inputInnerContainer: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  inputText: {
    fontSize: 14,
    marginLeft: 8,
  },
  leftIconContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
  rightIconContainer: {
    marginRight: 0,
  },
});

export default Header;
