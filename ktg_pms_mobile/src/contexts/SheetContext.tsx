import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, View } from "react-native";
import { BOTTOM_SHEET_SNAPPOINTS } from "~/constants";

interface SheetContextType {
  openSheet(content: React.ReactNode): void;
  openSheet(content: () => React.ReactNode): void;
  closeSheet(): void;
  isSheetLoading: boolean;
  setIsSheetLoading: (loading: boolean) => void;
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
  const [content, setContent] = useState<
    React.ReactNode | (() => React.ReactNode)
  >(null);
  const [sheetKey, setSheetKey] = useState(0);
  const lastOpenTime = useRef(0);

  useEffect(() => {
    if (content) {
      // Khi content thay đổi, đợi 1 frame (~16ms) để đảm bảo UI mount xong & đo đạc layout chuẩn
      const timer = setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 16);
      return () => clearTimeout(timer);
    }
  }, [content, sheetKey]);

  const [isSheetLoading, setIsSheetLoading] = useState(false);

  const openSheet = useCallback(
    (newContent: React.ReactNode | (() => React.ReactNode)) => {
      const now = Date.now();
      // Chốt chặn 500ms: Bảo vệ JS Thread không bị nghẽn do Spam render
      if (now - lastOpenTime.current < 500) return;
      lastOpenTime.current = now;

      setIsSheetLoading(true);

      setContent((prev) => {
        if (prev === newContent) {
          // Cùng nội dung, chỉ cần expand (đã xử lý bởi useEffect dựa trên key không đổi & content giữ nguyên)
          bottomSheetRef.current?.expand();
          return prev;
        }
        // Khác nội dung, đổi key để reset state & re-mount mới
        setSheetKey((k) => k + 1);
        return newContent;
      });
    },
    [],
  );

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <SheetContext.Provider
      value={{ openSheet, closeSheet, isSheetLoading, setIsSheetLoading }}
    >
      {children}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={BOTTOM_SHEET_SNAPPOINTS}
        enablePanDownToClose
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        keyboardBehavior={Platform.OS === "ios" ? "interactive" : "fillParent"}
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
            // Không set null để giữ lại nội dung cho lần mở tiếp theo (Tăng tốc độ Remount)
            setIsSheetLoading(false);
          }
        }}
        {...props}
      >
        <View key={sheetKey} style={{ flex: 1 }}>
          {typeof content === "function" ? (content as any)() : content}
        </View>
      </BottomSheet>
    </SheetContext.Provider>
  );
};

export default SheetProvider;
