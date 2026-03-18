import { Row } from "~/common";
import { colors } from "~/constants/colors";
import { Icon } from "@rneui/base";
import { Text } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CollapsibleMenuProps {
  title: string;
  titleColor?: string;
  icon: string;
  iconBg?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleMenu = ({
  title,
  titleColor = colors.primary,
  icon,
  iconBg = colors.primary + "15",
  children,
  defaultExpanded = false,
}: CollapsibleMenuProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentHeight = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const rotation = useDerivedValue(() => {
    return withTiming(expanded ? 90 : 0, { duration: 150 });
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(expanded ? contentHeight.value : 0, {
        duration: 150,
      }),
      opacity: withTiming(expanded ? 1 : 0, { duration: 150 }),
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Row justify="space-between" full>
          <Row gap={12}>
            <View style={[styles.mainIconCircle, { backgroundColor: iconBg }]}>
              <Icon
                name={icon}
                type="material"
                size={20}
                color={iconBg === "#F1F5F9" ? "#64748B" : colors.primary}
              />
            </View>
            <Text style={[styles.menuGroupTitle, { color: titleColor }]}>
              {title}
            </Text>
          </Row>

          <Animated.View style={animatedChevronStyle}>
            <Icon
              name="chevron-right"
              type="material"
              size={22}
              color="#94A3B8"
            />
          </Animated.View>
        </Row>
      </TouchableOpacity>

      <Animated.View style={[styles.collapsedContent, animatedHeightStyle]}>
        <View
          onLayout={(e) => {
            contentHeight.value = e.nativeEvent.layout.height;
          }}
          style={styles.measureWrapper}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  mainIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  menuGroupTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#334155",
  },
  collapsedContent: {
    overflow: "hidden",
  },
  measureWrapper: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 20,
  },
});
