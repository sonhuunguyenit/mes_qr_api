import { Row } from "../Row";
import { Text } from "../Text";
import { colors } from "~/constants/colors";
import { Icon, IconProps } from "@rneui/base";
import React, { useState } from "react";
import {
  ColorValue,
  StyleSheet,
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
import { useTheme } from "~/hooks/useTheme";

interface CollapseProps {
  title?: string | React.ReactNode;
  icon?: IconProps;
  rightSide?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  titleColor?: ColorValue;
  iconColor?: ColorValue;
  noHeaderPadding?: boolean;
  noContentPadding?: boolean;
}

export const Collapse = ({
  title,
  icon,
  rightSide,
  children,
  style,
  headerStyle,
  collapsible = false,
  defaultExpanded = true,
  expanded: expandedProp,
  onToggle,
  titleColor,
  iconColor,
  noHeaderPadding = false,
  noContentPadding = false,
}: CollapseProps) => {
  const { colors, radius, spacing } = useTheme();
  const [isExpandedInternal, setIsExpandedInternal] = useState(
    expandedProp !== undefined ? expandedProp : defaultExpanded,
  );

  const expanded = isExpandedInternal;

  const contentHeight = useSharedValue(0);
  const isFirstRender = useSharedValue(true);

  React.useEffect(() => {
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
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.card,
        },
        style,
      ]}
    >
      {title && (
        <HeaderWrapper
          onPress={collapsible ? toggleExpand : undefined}
          activeOpacity={0.7}
          style={[
            styles.headerTouchable,
            noHeaderPadding && { padding: 0 },
            headerStyle,
          ]}
        >
          <Row
            gap={8}
            align="center"
            style={[styles.sectionHeader, noHeaderPadding && { padding: 0 }]}
            full
          >
            {icon && (
              <Icon
                size={18}
                color={iconColor || titleColor || colors.primary}
                {...icon}
              />
            )}
            {typeof title === "string" ? (
              <Text
                bold
                size={15}
                color={titleColor || colors.title}
                style={{
                  flex: 1,
                  includeFontPadding: false,
                  textAlignVertical: "center",
                  lineHeight: 20, // Match icon baseline
                }}
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
                  color={iconColor || titleColor || colors.label}
                />
              </Animated.View>
            )}
          </Row>
        </HeaderWrapper>
      )}

      <Animated.View
        style={[
          collapsible ? styles.collapsedContent : undefined,
          animatedHeightStyle,
        ]}
      >
        <View
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && contentHeight.value === 0 && defaultExpanded) {
              // First time setting height for expanded component
              contentHeight.value = h;
            } else {
              contentHeight.value = h;
            }
          }}
          style={[
            collapsible ? styles.measureWrapper : undefined,
            !noContentPadding && styles.contentPadding,
          ]}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerTouchable: {
    padding: 16,
    width: "100%",
  },
  sectionHeader: {
    paddingVertical: 0,
    marginBottom: 0,
  },
  contentPadding: {
    paddingHorizontal: 8,
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
