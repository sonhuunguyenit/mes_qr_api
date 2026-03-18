import React, { createContext, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "~/constants/colors";

type ModalType = "modal" | "popup" | "loading";

export interface ModalOptions {
  type?: ModalType;
  title?: string;
  message?: string;
  component?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
  showButton?: boolean;
}

interface ModalContextValue {
  show: (options: ModalOptions) => void;
  hide: () => void;
}

export const ModalContext = createContext<ModalContextValue>({
  show: () => {},
  hide: () => {},
});

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState<{
    isShow: boolean;
    options: ModalOptions | null;
  }>({
    isShow: false,
    options: null,
  });

  const show = React.useCallback((opts: ModalOptions) => {
    setModalState({
      isShow: true,
      options: {
        overlay: true,
        ...opts,
      },
    });
  }, []);

  const hide = React.useCallback(() => {
    setModalState((prev) =>
      prev.isShow ? { isShow: false, options: null } : prev,
    );
  }, []);

  const { isShow, options } = modalState;
  const isLoading = options?.type === "loading";
  const isPopup = options?.type === "popup";

  const value = React.useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ModalContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}

        {isShow && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: 99999,
                elevation: 99999,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Pressable
              style={styles.backdrop}
              onPress={() => {
                if ((isLoading && options?.overlay) || !isLoading) hide();
              }}
            />
            <View style={[styles.box, options?.style]}>
              {options?.title && (
                <Text style={styles.title}>{options.title}</Text>
              )}

              {isLoading && (
                <ActivityIndicator
                  size="large"
                  style={{ paddingBottom: 10 }}
                  color={colors.primary}
                />
              )}

              {options?.message && (
                <Text style={styles.message}>{options.message}</Text>
              )}

              {options?.component}

              <View style={[styles.actions, { gap: 10 }]}>
                {(options?.onConfirm || isPopup) && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.active }]}
                    onPress={() => {
                      options?.onConfirm?.();
                      hide();
                    }}
                  >
                    <Text style={[styles.buttonText, { color: "#fff" }]}>
                      {isPopup ? "Đồng ý" : options?.confirmText || "Xác nhận"}
                    </Text>
                  </TouchableOpacity>
                )}
                {!isPopup && options?.onCancel && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      options?.onCancel?.();
                      hide();
                    }}
                  >
                    <Text style={[styles.buttonText, { color: "#64748B" }]}>
                      {options?.cancelText || "Hủy bỏ"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </ModalContext.Provider>
  );
};

export default ModalProvider;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  box: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
    paddingBottom: 10,
    fontWeight: "700",
  },
  message: {
    textAlign: "center",
    color: "#444",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 10,
  },
  button: {
    borderColor: "#d9d9d9",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 4,
    minHeight: 32,
    justifyContent: "center",
    borderRadius: 24,
    height: 50,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
