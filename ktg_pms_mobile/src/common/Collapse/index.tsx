import { Icon, IconProps } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  ColorValue,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Row } from "../Row";
import { Text } from "../Text";
import { useTheme } from "~/hooks/useTheme";

interface CollapseProps {
  title?: string | React.ReactNode;
  icon?: IconProps;
  rightSide?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  titleColor?: ColorValue;
  iconColor?: ColorValue;
  titleStyle?: TextStyle;
}

export const Collapse = ({
  title,
  icon,
  rightSide,
  children,
  style,
  headerStyle,
  containerStyle,
  collapsible = false,
  defaultExpanded = false,
  expanded: expandedProp,
  onToggle,
  titleColor,
  iconColor,
  titleStyle,
}: CollapseProps) => {
  const { colors } = useTheme();
  const [isExpandedInternal, setIsExpandedInternal] = useState(
    expandedProp !== undefined ? expandedProp : defaultExpanded,
  );

  const expanded = isExpandedInternal;

  const contentHeight = useSharedValue(0);
  const isFirstRender = useSharedValue(true);

  useEffect(() => {
    if (expandedProp !== undefined) {
      setIsExpandedInternal(expandedProp);
    }
  }, [expandedProp]);

  const toggleExpand = () => {
    isFirstRender.value = false;
    const nextValue = !isExpandedInternal;
    setIsExpandedInternal(nextValue);
    onToggle?.(nextValue);
  };

  const rotation = useDerivedValue(() => {
    if (isFirstRender.value && defaultExpanded) return 0;
    return withTiming(expanded ? 0 : -180, { duration: 180 });
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    const targetHeight = expanded ? contentHeight.value : 0;
    const targetOpacity = expanded ? 1 : 0;

    // Skip timing for initial render if defaultExpanded is true
    if (isFirstRender.value && defaultExpanded && contentHeight.value > 0) {
      return {
        height: targetHeight,
        opacity: targetOpacity,
      };
    }

    return {
      height: withTiming(targetHeight, {
        duration: 180,
      }),
      opacity: withTiming(targetOpacity, { duration: 180 }),
    };
  });

  const HeaderWrapper = collapsible ? TouchableOpacity : View;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      <View style={{ borderRadius: 12, overflow: "hidden", width: "100%" }}>
        {title && (
          <HeaderWrapper
            onPress={collapsible ? toggleExpand : undefined}
            activeOpacity={0.7}
            style={[styles.headerTouchable, headerStyle]}
          >
            <Row gap={5} align="center" style={[styles.sectionHeader]} full>
              {icon && (
                <Icon size={18} color={iconColor || colors.title} {...icon} />
              )}
              {typeof title === "string" ? (
                <Text
                  bold
                  size={15}
                  color={titleColor || colors.title}
                  style={[
                    {
                      flex: 1,
                      includeFontPadding: false,
                      textAlignVertical: "center",
                    },
                    titleStyle,
                  ]}
                >
                  {title}
                </Text>
              ) : (
                <View style={{ flex: 1 }}>{title}</View>
              )}
              {rightSide && rightSide}
              {collapsible && (
                <Animated.View style={animatedChevronStyle}>
                  <Icon
                    name="chevron-up"
                    type="feather"
                    size={20}
                    color={iconColor || colors.title}
                  />
                </Animated.View>
              )}
            </Row>
          </HeaderWrapper>
        )}

        {!collapsible ? (
          <View style={styles.contentPadding}>{children}</View>
        ) : (
          <Animated.View
            style={[
              styles.collapsedContent,
              animatedHeightStyle,
              { width: "100%" },
            ]}
          >
            <View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && contentHeight.value === 0 && defaultExpanded) {
                  contentHeight.value = h;
                } else {
                  contentHeight.value = h;
                }
              }}
              style={[
                styles.measureWrapper,
                styles.contentPadding,
                containerStyle,
              ]}
            >
              {children}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: "100%",
    alignSelf: "stretch",
  },
  headerTouchable: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    width: "100%",
    justifyContent: "center",
  },
  sectionHeader: {
    paddingVertical: 0,
    marginBottom: 0,
  },
  contentPadding: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 8,
  },
  collapsedContent: {
    overflow: "hidden",
  },
  measureWrapper: {
    position: "absolute",
    width: "100%",
  },
});
