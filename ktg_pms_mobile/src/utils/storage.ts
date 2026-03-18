import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageHelper = {
  get: async <T = string>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value) {
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as unknown as T;
        }
      }
      return null;
    } catch (e) {
      console.warn(`Error reading key ${key}`, e);
      return null;
    }
  },

  set: async (key: string, value: string | null) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`Error setting key ${key}`, e);
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error deleting key ${key}`, e);
    }
  },
};

export default StorageHelper;
