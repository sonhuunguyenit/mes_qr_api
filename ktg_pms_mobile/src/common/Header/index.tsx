import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "~/assets";
import { Input } from "../Input";
import { Row } from "../Row";
import { Text } from "../Text";
import { BOTTOM_SHEET_TIME_LOADING } from "~/constants";
import { ROUTE_KEYS } from "~/constants/route";
import { useSheet } from "~/contexts/SheetContext";

import { useTheme } from "~/hooks/useTheme";

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
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { isSheetLoading } = useSheet();
  const [isSpinning, setIsSpinning] = React.useState(false);

  const handleFilter = React.useCallback(() => {
    if (!onFilter) return;
    setIsSpinning(true);
    setTimeout(() => {
      onFilter();
    }, 0);
    setTimeout(() => {
      setIsSpinning(false);
    }, BOTTOM_SHEET_TIME_LOADING);
  }, [onFilter]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ROUTE_KEYS.Home);
    }
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
          style={[styles.iconButton, { backgroundColor: colors.lgrayBg }]}
        >
          <Icon
            name="chevron-left"
            type="feather"
            size={26}
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
          <Text size={16} weight="800" style={{ color: colors.title }}>
            {title}
          </Text>
        )}
        {subTitle && (
          <Row gap={5} margin={[3, 0, 0, 0]}>
            <Icon name="circle" type="material" size={5} color={colors.title} />
            <Text size={13} weight={"700"} color={colors.title}>
              {subTitle}
            </Text>
          </Row>
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
        style={[styles.iconButton, { backgroundColor: colors.lgrayBg }]}
      >
        <Icon
          name="notifications-outline"
          type="ionicon"
          size={23}
          color={colors.lgrayIcon}
        />
        {hasNotification && (
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.badgeRed, borderColor: colors.white },
            ]}
          />
        )}
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
            <Icon
              name="search"
              type="feather"
              size={18}
              color={colors.slate400}
            />
          }
          rightIcon={
            onFilter ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {isSheetLoading || isSpinning ? (
                  <View style={{ padding: 4 }}>
                    <ActivityIndicator size="small" color={colors.active} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleFilter}
                    activeOpacity={1}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      padding: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="sliders"
                      type="feather"
                      size={18}
                      color={colors.active}
                    />
                    {hasFilter && (
                      <View
                        style={[
                          styles.filterBadge,
                          {
                            backgroundColor: colors.badgeRed,
                            borderColor: colors.white,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ) : undefined
          }
          containerStyle={styles.inputContainer}
          inputContainerStyle={[
            styles.inputInnerContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          inputStyle={[styles.inputText, { color: colors.title }]}
          leftIconContainerStyle={styles.leftIconContainer}
          rightIconContainerStyle={styles.rightIconContainer}
        />
      );
    }

    return (
      <View
        style={[
          styles.fakeInput,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={handleFilter}
          activeOpacity={0.6}
          style={styles.fakeInputTouch}
        >
          <View style={styles.fakeInputContent}>
            <Icon
              name="search"
              type="feather"
              size={18}
              color={colors.slate400}
            />
            <Text
              style={[styles.fakeInputPlaceholder, { color: colors.slate400 }]}
            >
              {onInput?.placeholder ?? "Tìm kiếm chi tiết..."}
            </Text>
          </View>

          {onFilter && (
            <View style={{ padding: 5 }}>
              {isSheetLoading || isSpinning ? (
                <ActivityIndicator size="small" color={colors.active} />
              ) : (
                <View>
                  <Icon
                    name="sliders"
                    type="feather"
                    size={16}
                    color={colors.active}
                  />
                  {hasFilter && (
                    <View
                      style={[
                        styles.filterBadge,
                        {
                          backgroundColor: colors.badgeRed,
                          borderColor: colors.white,
                        },
                      ]}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.headerBg,
          {
            backgroundColor: backgroundColor || colors.header,
            paddingTop: insets.top,
            paddingBottom: showSearch ? 30 : 5,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.leftSection}>{renderLeft()}</View>

          <View style={styles.centerSection} pointerEvents="none">
            {renderCenter()}
          </View>

          <View style={styles.rightSection}>{renderRight()}</View>
        </View>
      </View>

      {showSearch && <View style={styles.searchWrapper}>{renderSearch()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  headerBg: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 1,
  },
  centerSection: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  filterBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  titleText: {},
  subTitleText: {},
  searchWrapper: {
    marginTop: -21,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  fakeInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  fakeInputTouch: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  fakeInputContent: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fakeInputPlaceholder: {
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 0,
    height: 50,
  },
  inputInnerContainer: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderBottomWidth: 1,
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
