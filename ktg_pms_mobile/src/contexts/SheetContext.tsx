import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { configureReanimatedLogger } from "react-native-reanimated";
import { View } from "react-native";

configureReanimatedLogger({
  strict: false,
});

interface SheetContextType {
  openSheet(content: React.ReactNode): void;
  openSheet(content: () => React.ReactNode): void;
  closeSheet(): void;
}

const SheetContext = createContext<SheetContextType | null>(null);

export const useSheet = () => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used within SheetProvider");
  return ctx;
};

const SheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [sheetKey, setSheetKey] = useState(0);
  const lastOpenTime = useRef(0);

  // Khi content thay đổi, đợi 4 frames (~64ms) để đảm bảo UI mount xong & đo đạc layout chuẩn
  // Cách này triệt tiêu hoàn toàn lỗi "đứng hình" giữa chừng vì race condition
  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 64);
      return () => clearTimeout(timer);
    }
  }, [content, sheetKey]);

  const openSheet = useCallback(
    (content: React.ReactNode | (() => React.ReactNode)) => {
      const now = Date.now();
      // Chốt chặn 500ms: Bảo vệ JS Thread không bị nghẽn do Spam render
      if (now - lastOpenTime.current < 500) return;
      lastOpenTime.current = now;

      const node = typeof content === "function" ? content() : content;
      setSheetKey((prev) => prev + 1);
      setContent(node);
    },
    [],
  );

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
        onChange={(index) => {
          if (index === -1) {
            setContent(null);
          }
        }}
        {...props}
      >
        <View key={sheetKey} style={{ flex: 1 }}>
          {content}
        </View>
      </BottomSheet>
    </SheetContext.Provider>
  );
};

export default SheetProvider;
