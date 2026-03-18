import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "~/common";
import { useTheme } from "~/hooks/useTheme";

interface TabItem {
  label: string;
  value: any;
}

interface SegmentedTabProps {
  tabs: TabItem[];
  activeTab: any;
  onChange: (value: any) => void;
}

export const SegmentedTab = ({
  tabs,
  activeTab,
  onChange,
}: SegmentedTabProps) => {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorPosition = useSharedValue(0);

  const tabWidth = containerWidth / tabs.length;

  useEffect(() => {
    if (tabWidth > 0) {
      const index = tabs.findIndex((t) => t.value === activeTab);
      indicatorWidth.value = withTiming(tabWidth * 1, { duration: 250 });
      indicatorPosition.value = withTiming(index * tabWidth, {
        duration: 250,
      });
    }
  }, [activeTab, tabWidth, tabs]);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
      onLayout={onContainerLayout}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary,
            height: 2,
            bottom: 0,
          },
          animatedIndicatorStyle,
        ]}
      />
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            activeOpacity={0.7}
            onPress={() => onChange(tab.value)}
            style={styles.tabItem}
          >
            <Text
              bold={isActive}
              size={14}
              color={isActive ? colors.primary : colors.label}
              numberOfLines={1}
              style={styles.tabText}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  indicator: {
    position: "absolute",
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
