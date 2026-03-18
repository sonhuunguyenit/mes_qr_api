import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("screen");

export const normalize = (
  fontSize: number,
  standardScreenHeight = 680
): number => {
  const isIphoneX = (): boolean => {
    const dim = Dimensions.get("window");
    const iPhoneXHeights = [780, 812, 844, 896, 926];

    return (
      Platform.OS === "ios" &&
      !Platform.isPad &&
      !Platform.isTV &&
      (iPhoneXHeights.includes(dim.height) ||
        iPhoneXHeights.includes(dim.width))
    );
  };

  const standardLength = Math.max(width, height);
  let offset = 0;

  if (width < height) {
    offset = Platform.OS === "ios" ? 78 : StatusBar.currentHeight || 0;
  }

  const adjustedHeight =
    isIphoneX() || Platform.OS === "android"
      ? standardLength - offset
      : standardLength;

  const heightPercent = (fontSize * adjustedHeight) / standardScreenHeight;

  return Math.round(heightPercent);
};

export const typography = (size: number) => {
  const WIDTH = Math.min(width, height);

  const HEIGHT = Math.max(width, height);

  const baseWidth = 375;

  const baseHeight = 812;

  const WIDTH_SCALE = WIDTH / baseWidth;

  const HEIGHT_SCALE = HEIGHT / baseHeight;

  const scale = Math.min(WIDTH_SCALE, HEIGHT_SCALE);

  const fontSize =
    PixelRatio.get() <= 1.5
      ? 12
      : PixelRatio.get() > 1.5 && PixelRatio.get() < 3
      ? 13
      : 14;

  return Math.ceil(fontSize * scale);
};
