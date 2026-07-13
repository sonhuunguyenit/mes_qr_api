import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "~/hooks/useTheme";
import { Button } from "~/common";

interface Action {
  label: string;
  onPress: () => void;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  type?: "primary" | "danger" | "warning" | "success" | "secondary";
  id?: string;
}

interface ApprovalButtonProps {
  onApprove?: () => void;
  onReject?: () => void;
  onRecheck?: () => void;
  actions?: Action[];
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ApprovalButton = ({
  onApprove,
  onReject,
  onRecheck,
  actions = [],
  isLoading,
  style,
}: ApprovalButtonProps) => {
  const { colors, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading) {
      setActiveActionId(null);
    }
  }, [isLoading]);

  const handlePress = useCallback(
    (id: string, callback?: () => void) => {
      if (!callback || isLoading || activeActionId) return;

      setActiveActionId(id);
      callback();

      setTimeout(() => {
        if (!isLoading) {
          setActiveActionId(null);
        }
      }, 1500);
    },
    [isLoading, activeActionId],
  );

  const getActionStyle = (action: Action) => {
    switch (action.type) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          color: colors.black,
        };
      case "danger":
        return {
          backgroundColor: colors.lredBg,
          color: colors.red,
          borderColor: colors.red,
          borderWidth: 0.5,
        };
      case "warning":
        return {
          backgroundColor: colors.white,
          color: colors.active,
          borderColor: colors.active,
          borderWidth: 1,
        };
      case "success":
        return {
          backgroundColor: colors.lgreenBg,
          color: colors.green,
          borderColor: colors.green,
          borderWidth: 0.5,
        };
      case "secondary":
        return {
          backgroundColor: colors.blue,
          color: colors.white,
          borderColor: colors.border,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: action.bgColor || colors.primary,
          color: action.color || colors.black,
          borderColor: action.borderColor,
          borderWidth: action.borderColor ? 1 : 0,
        };
    }
  };

  const finalActions: Action[] = [...actions];

  if (onRecheck) {
    finalActions.push({
      id: "recheck",
      label: "Kiểm tra lại",
      onPress: onRecheck,
      type: "warning",
    });
  }
  if (onReject) {
    finalActions.push({
      id: "reject",
      label: "Từ chối",
      onPress: onReject,
      type: "danger",
    });
  }
  if (onApprove) {
    finalActions.push({
      id: "approve",
      label: "Phê duyệt",
      onPress: onApprove,
      type: "primary",
    });
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: colors.card as string,
        },
        style,
      ]}
    >
      <View style={styles.scrollContent}>
        {finalActions.map((action, index) => {
          const actionStyle = getActionStyle(action);
          const isActionActive = activeActionId === (action.id || action.label);
          const isDisabled =
            isLoading || (activeActionId !== null && !isActionActive);

          return (
            <Button
              key={action.id || action.label || index}
              title={action.label}
              icon={
                isLoading && isActionActive ? (
                  <ActivityIndicator
                    size="small"
                    color={actionStyle.color as string}
                    style={{ marginRight: 8 }}
                  />
                ) : undefined
              }
              disabled={isDisabled}
              onPress={() =>
                handlePress(action.id || action.label, action.onPress)
              }
              containerStyle={styles.btnAction}
              buttonStyle={[
                styles.btnBase,
                {
                  backgroundColor: actionStyle.backgroundColor as string,
                  borderColor: actionStyle.borderColor as string,
                  borderWidth: actionStyle.borderWidth || 0,
                  borderRadius: radius.button,
                },
              ]}
              titleStyle={{
                fontSize: 13,
                color: actionStyle.color as string,
                fontWeight: "600",
              }}
              disabledStyle={{
                opacity: 0.5,
                backgroundColor: colors.disabled,
                borderColor: colors.disabled,
              }}
              disabledTitleStyle={{ color: actionStyle.color as string }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  scrollContent: {
    flexDirection: "row",
    gap: 12,
  },
  btnAction: {
    flex: 1,
  },
  btnBase: {
    height: 48,
    paddingHorizontal: 16,
    elevation: 0,
    shadowColor: "transparent",
  },
});
