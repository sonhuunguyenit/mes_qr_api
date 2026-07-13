import { useTheme } from "~/hooks/useTheme";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

type Props = Omit<LinearGradientProps, "colors"> & {
  colors?: readonly [string, string, ...string[]];
  children?: React.ReactNode;
};

export const Linear = ({ children, colors, ...rest }: Props) => {
  const { colors: themeColors } = useTheme();

  const resolvedColors =
    colors || ([themeColors.neutral200, themeColors.neutral200] as const);

  // Ensure locations matches the length of colors to avoid crashes
  const locations =
    rest.locations || (resolvedColors.length === 2 ? [0, 1] : undefined);

  return (
    <LinearGradient
      colors={resolvedColors as any}
      locations={locations}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
};
