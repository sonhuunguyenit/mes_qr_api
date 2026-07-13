import React, { useState, useRef } from "react";
import {
  LayoutChangeEvent,
  ViewStyle,
  View,
  StyleProp,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { Skeleton } from "@rneui/base";
import { useTheme } from "~/hooks/useTheme";

interface CardProps {
  shadow?: boolean;
  padding?: number;
  backgroundColor?: string;
  loading?: boolean;
  skeleton?: boolean;
  onPress?: () => void;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({
  shadow,
  padding,
  backgroundColor,
  skeleton = false,
  style,
  children,
  onPress,
  width,
  height,
}: CardProps) => {
  const { colors, spacing, radius } = useTheme();
  const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (skeleton && (cardLayout.width !== w || cardLayout.height !== h)) {
      setCardLayout({ width: w, height: h });
    }
  };

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    }
  };

  const renderContent = () => (
    <Animated.View
      style={[
        shadow && !skeleton && styles.shadowWrapper,
        {
          width: width as any,
          height: height as any,
          transform: [{ scale: scaleAnim }],
          backgroundColor: skeleton
            ? "transparent"
            : (backgroundColor ?? colors.card),
          borderRadius: radius.card,
          borderWidth: skeleton ? 0 : 1,
          borderColor: colors.divider,
          shadowColor: shadow && !skeleton ? (colors.black as any) : undefined,
          paddingHorizontal: skeleton ? 0 : 5,
          paddingVertical: 8,
        },
        style,
      ]}
      onLayout={handleLayout}
    >
      <View style={styles.innerContainer}>
        {children}

        {skeleton && !children && cardLayout.width > 0 && (
          <Skeleton
            animation="wave"
            width={cardLayout.width}
            height={cardLayout.height}
            skeletonStyle={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
            }}
            style={styles.skeletonOverlay}
          />
        )}
      </View>
    </Animated.View>
  );

  if (onPress && !skeleton) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  innerContainer: {
    flex: 1,
    overflow: "hidden",
  },
  skeletonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
});
