import React from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

// "#FFEEA3", "#FFE680" "#FFEEA3" "FFFDF2" "FFFDF2"
// "#FFFDF2", "#FFFDF2" #fffbf7 #fffbf7
// "#F6FAF9", "#E5F6EF", "#E3F7F4", "#EEF9F6"
// background
// #1C1C1E #121212 #0F172A #E5E7EB #F5F5F7 #F4F7FA
// #F8FAFC #E2E8F0 #F1F5F9 #0B0F1A #020617 #111827
// #FBFBFD #F5F5F7 #1D1D1F #6E6E73
// F4F7FA EEF2F7
const DefaultLinear = ["#EEF2F7", "#EEF2F7"] as const;

type Props = Omit<LinearGradientProps, "colors"> & {
  colors?: readonly [string, string, ...string[]];
  children?: React.ReactNode;
};

export const Linear = ({
  children,
  colors = DefaultLinear,
  ...rest
}: Props) => {
  // Ensure locations matches the length of colors to avoid crashes
  const locations =
    rest.locations || (colors.length === 2 ? [0, 1] : undefined);

  return (
    <LinearGradient
      colors={colors}
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
