import { Icon, TabView, TabViewProps } from "@rneui/base";
import React, { createContext, useContext, useMemo } from "react";
import {
  ColorValue,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { sizes } from "~/constants/sizes";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../Text";

// ─── Context ────────────────────────────────────────────────────────────────

interface TabsContextProps {
  value: number;
  onChange: (index: number) => void;
  mode: "underline" | "pill";
  dense: boolean;
  registerItem: (index: number) => void;
  activeColor?: ColorValue;
  activeBackgroundColor?: ColorValue;
  activeBorderColor?: ColorValue;
}

const TabsContext = createContext<TabsContextProps>({
  value: 0,
  onChange: () => {},
  mode: "underline",
  dense: false,
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
  activeColor?: ColorValue;
  activeBackgroundColor?: ColorValue;
  activeBorderColor?: ColorValue;
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
  activeColor,
  activeBackgroundColor,
  activeBorderColor,
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

  const barStyle = useMemo<ViewStyle>(
    () => ({
      flexDirection: "row",
      backgroundColor: colors.tabs as string,
      height: dense ? 44 : 54,
      borderRadius: 0,
      padding: isPill ? 6 : 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border as string,
      alignItems: "center",
    }),
    [isPill, dense, colors],
  );

  const contextValue = useMemo(
    () => ({
      value,
      onChange,
      mode,
      dense,
      registerItem: () => {},
      activeColor,
      activeBackgroundColor,
      activeBorderColor,
    }),
    [
      value,
      onChange,
      mode,
      dense,
      activeColor,
      activeBackgroundColor,
      activeBorderColor,
    ],
  );

  const content = <View style={[barStyle, containerStyle]}>{items}</View>;

  return (
    <TabsContext.Provider value={contextValue}>
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ height: dense ? 44 : 54, flexGrow: 0 }}
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
  const { colors, fonts, radius, isDark } = useTheme();
  const {
    value,
    onChange,
    mode,
    dense,
    activeColor: contextActiveColor,
    activeBackgroundColor: contextActiveBackgroundColor,
    activeBorderColor: contextActiveBorderColor,
  } = useContext(TabsContext);

  const active = value === _index;
  const isPill = mode === "pill";
  const activeColor = contextActiveColor || colors.active;
  const inactiveColor = isDark ? colors.label : colors.slate600;
  const iconColor = active
    ? isPill
      ? contextActiveColor || colors.card
      : activeColor
    : inactiveColor;

  const itemStyle = useMemo<ViewStyle>(
    () => ({
      flex: 1,
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 12,
      backgroundColor:
        isPill && active
          ? (contextActiveBackgroundColor || colors.primary) as string
          : "transparent",
      borderRadius: isPill ? 8 : 0,
      borderWidth: isPill && active ? 1.5 : 0,
      borderColor:
        isPill && active
          ? (contextActiveBorderColor || activeColor) as string
          : "transparent",
      flexShrink: 0,
      marginVertical: isPill ? 3 : 0,
    }),
    [
      active,
      isPill,
      dense,
      colors,
      radius,
      contextActiveBackgroundColor,
      contextActiveBorderColor,
      activeColor,
    ],
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
        <Icon name={iconName} type={iconType} size={18} color={iconColor as string} />
      )}
      {label && (
        <Text
          numberOfLines={1}
          weight={active ? "700" : "500"}
          size={sizes.fontSize.md}
          color={
            active
              ? isPill
                ? contextActiveColor || colors.card
                : activeColor
              : inactiveColor
          }
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

      {!isPill && active && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: activeColor as string,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            zIndex: 1,
          }}
        />
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
  backgroundColor: colors.error as string,
  borderWidth: 1.5,
  borderColor: colors.card as string,
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
