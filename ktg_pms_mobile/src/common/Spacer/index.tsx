import { View } from "react-native";

interface SpacerProps {
  size?: number;
  horizontal?: boolean;
}

export const Spacer = ({ size = 10, horizontal }: SpacerProps) => {
  const isHorizontal = horizontal ?? false;

  return (
    <View
      style={
        isHorizontal ? { width: size, height: 1 } : { height: size, width: 1 }
      }
    />
  );
};
