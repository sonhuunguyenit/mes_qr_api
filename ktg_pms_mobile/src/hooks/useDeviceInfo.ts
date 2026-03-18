import { Platform, Dimensions } from 'react-native';

export const useDeviceInfo = () => {
  const { width, height } = Dimensions.get('window');

  return {
    platform: Platform.OS,
    osVersion: Platform.Version,
    width,
    height,
    isSmallDevice: width < 360,
  };
};
