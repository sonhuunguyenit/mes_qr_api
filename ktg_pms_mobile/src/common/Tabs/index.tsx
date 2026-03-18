import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { TabView, TabViewProps } from "@rneui/base";
import { Icon } from "@rneui/base";
import { useTheme } from "../../hooks/useTheme";
import { sizes } from "~/constants/sizes";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  LayoutChangeEvent,
} from "react-native";
import { Text } from "../Text";

// ─── Context ────────────────────────────────────────────────────────────────

interface TabsContextProps {
  value: number;
  onChange: (index: number) => void;
  mode: "underline" | "pill";
  dense: boolean;
  itemCount: number;
  registerItem: (index: number) => void;
}

const TabsContext = createContext<TabsContextProps>({
  value: 0,
  onChange: () => {},
  mode: "underline",
  dense: false,
  itemCount: 0,
  registerItem: () => {},
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TabsProps {
  value: number;
  onChange: (index: number) => void;
  mode?: "underline" | "pill";
  dense?: boolean;
  scrollable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export interface TabsItemProps {
  label?: string;
  iconName?: string;
  iconType?: string;
  capitalize?: boolean;
  dot?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  /** Injected automatically — do NOT pass manually */
  _index?: number;
}

// ─── Tabs (Tab Bar) ──────────────────────────────────────────────────────────

const TabsComponent = ({
  value,
  onChange,
  mode = "underline",
  dense = false,
  scrollable = false,
  containerStyle,
  children,
}: TabsProps) => {
  const { colors, radius } = useTheme();
  const isPill = mode === "pill";

  // Clone children để inject _index
  const items = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<TabsItemProps>, {
      _index: index,
    });
  });

  const itemCount = React.Children.count(children);

  const barStyle = useMemo<ViewStyle>(
    () => ({
      flexDirection: "row",
      backgroundColor: isPill ? colors.divider : colors.card,
      height: dense ? 40 : 50,
      borderRadius: isPill ? radius.md : 0,
      padding: isPill ? 4 : 0,
      borderBottomWidth: isPill ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      alignItems: "center",
    }),
    [isPill, dense, colors, radius],
  );

  const contextValue = useMemo(
    () => ({
      value,
      onChange,
      mode,
      dense,
      itemCount,
      registerItem: () => {},
    }),
    [value, onChange, mode, dense, itemCount],
  );

  const content = (
    <View
      style={[barStyle, !scrollable && { overflow: "hidden" }, containerStyle]}
    >
      {items}
      {/* Underline indicator */}
      {!isPill && itemCount > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: `${(value / itemCount) * 100}%` as any,
            width: `${(1 / itemCount) * 100}%` as any,
            height: 2,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      )}
    </View>
  );

  return (
    <TabsContext.Provider value={contextValue}>
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </TabsContext.Provider>
  );
};

// ─── Tabs.Item ───────────────────────────────────────────────────────────────

const TabItemComponent = ({
  label,
  iconName,
  iconType = "material-community",
  capitalize = false,
  dot = false,
  containerStyle,
  titleStyle,
  _index = 0,
}: TabsItemProps) => {
  const { colors, fonts, radius } = useTheme();
  const { value, onChange, mode, dense, itemCount } = useContext(TabsContext);

  const active = value === _index;
  const isPill = mode === "pill";
  const activeColor = colors.primary;
  const inactiveColor = colors.label;
  const iconColor = active
    ? isPill
      ? colors.card
      : activeColor
    : inactiveColor;

  const itemStyle = useMemo<ViewStyle>(
    () => ({
      flex: 1,
      height: dense ? 32 : 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 8,
      backgroundColor: isPill && active ? colors.primary : "transparent",
      borderRadius: isPill ? radius.sm : 0,
      // Tránh shrink khi scroll ngang
      flexShrink: 0,
    }),
    [active, isPill, dense, colors, radius],
  );

  const labelStyle = useMemo<TextStyle>(
    () => ({
      fontSize: sizes.fontSize.base,
      fontFamily: active ? fonts.bold : fonts.regular,
      color: active ? (isPill ? colors.card : activeColor) : inactiveColor,
      textTransform: capitalize ? "capitalize" : "none",
      letterSpacing: 0.2,
    }),
    [active, isPill, fonts, colors, capitalize, activeColor, inactiveColor],
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onChange(_index)}
      style={[itemStyle, containerStyle]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      {iconName && (
        <Icon name={iconName} type={iconType} size={18} color={iconColor} />
      )}
      {label && (
        <Text
          numberOfLines={1}
          weight={active ? "600" : "400"}
          size={sizes.fontSize.base}
          color={active ? (isPill ? colors.card : activeColor) : inactiveColor}
          style={[
            {
              textTransform: capitalize ? "capitalize" : "none",
            },
            titleStyle,
          ]}
        >
          {label}
        </Text>
      )}

      {dot && <View style={dotStyle(colors)} />}
    </TouchableOpacity>
  );
};

const dotStyle = (colors: any): ViewStyle => ({
  position: "absolute",
  top: 6,
  right: 6,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.error,
  borderWidth: 1.5,
  borderColor: colors.card,
});

// ─── Tabs.View + Tabs.Content ────────────────────────────────────────────────

const TabViewComponent = ({
  children,
  ...props
}: React.PropsWithChildren<TabViewProps>) => (
  <TabView
    {...props}
    // Tắt swipe vì chỉ dùng press
    disableSwipe
    containerStyle={[{ flex: 1 }, props.containerStyle]}
  >
    {children}
  </TabView>
);

const TabContentComponent = ({ children, style, ...rest }: any) => (
  <TabView.Item {...rest}>
    <View style={[{ width: "100%", flex: 1 }, style]}>{children}</View>
  </TabView.Item>
);

// ─── Export ──────────────────────────────────────────────────────────────────

export const Tabs = Object.assign(TabsComponent, {
  Item: TabItemComponent,
  View: TabViewComponent,
  Content: TabContentComponent,
});
