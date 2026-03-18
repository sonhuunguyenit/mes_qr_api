import { APP_THEME } from "~/constants";
import { APP_THEME_TYPE, STORAGE_KEYS } from "~/constants/storage";
import StorageHelper from "~/utils/storage";
import React, { createContext, useEffect, useState } from "react";

type AppThemeContextType = {
  appTheme: APP_THEME_TYPE;
  setAppTheme: (theme: APP_THEME_TYPE) => void;
};

export const AppThemeContext = createContext<AppThemeContextType | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = useState<APP_THEME_TYPE>(
    STORAGE_KEYS.APP_THEME,
  );

  useEffect(() => {
    const getAppTheme = async () => {
      const scheme = await StorageHelper.get<APP_THEME_TYPE>(APP_THEME);

      if (scheme) {
        setAppTheme(scheme);
      }
    };

    getAppTheme();
  }, []);

  return (
    <AppThemeContext.Provider
      value={{
        appTheme,
        setAppTheme,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
};

export default ThemeProvider;
