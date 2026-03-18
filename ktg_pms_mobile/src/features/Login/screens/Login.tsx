import { yupResolver } from "@hookform/resolvers/yup";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Images } from "~/assets";
import { Column, Divider, Input, Linear, Row, Spacer, Text } from "~/common";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "~/constants";
import { colors } from "~/constants/colors";
import { STORAGE_KEYS } from "~/constants/storage";
import useLogin from "~/hooks/useLogin";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import StorageHelper from "~/utils/storage";
import ValidateHelper, { LoginSchema } from "~/utils/validation";

type FormData = LoginSchema;

const Login = () => {
  const insets = useSafeAreaInsets();
  const { start, stop } = useWaiting();
  const isFocused = useIsFocused();
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin } = useLogin();
  const { showToast } = useToast();
  const [rememberUsername, setRememberUsername] = useState(true);
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const topShapeY = useRef(new Animated.Value(-200)).current;
  const bottomShapeY = useRef(new Animated.Value(200)).current;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(ValidateHelper.login),
    mode: "onBlur",
    defaultValues: {
      username: "admin",
      password: "123456",
    },
  });

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(topShapeY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bottomShapeY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]);

  useEffect(() => {
    const loadSavedUsername = async () => {
      const savedUsername = await StorageHelper.get<string>(
        STORAGE_KEYS.SAVED_USERNAME,
      );
      if (savedUsername) {
        setValue("username", savedUsername);
        setRememberUsername(true);
      }
    };
    loadSavedUsername();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      start();
      await onLogin({ username: data.username, password: data.password });
    } catch (error: any) {
      showToast({
        type: "danger",
        message: error?.message || "Đăng nhập thất bại",
      });
    } finally {
      stop();
    }
  };

  return (
    <Linear style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Background Shapes */}
      <Animated.View
        style={[
          styles.bgTopShape,
          { transform: [{ rotate: "-10deg" }, { translateY: topShapeY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgBottomShape,
          { transform: [{ rotate: "-10deg" }, { translateY: bottomShapeY }] },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo — không box trắng, hiển thị trực tiếp trên nền */}
          <View
            style={[
              styles.header,
              { paddingTop: insets.top, height: SCREEN_HEIGHT * 0.26 },
            ]}
          >
            <Image
              source={Images.logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Animated.View
            style={[
              styles.shadowWrapper,
              { transform: [{ translateY }], opacity },
            ]}
          >
            <View style={styles.loginCard}>
              <View style={styles.cardHeader}>
                <Column align="stretch" gap={6}>
                  {/* Title — một màu đen, không tách vàng/đen */}
                  <Text size={24} weight="800" color="#1A1C1E">
                    Đăng nhập
                  </Text>
                  <Text size={28} weight="900" color={"#FFB300"}>
                    Tài khoản
                    <Text label weight="600" size={15} color={colors.label}>
                      {"  "}
                      Tập đoàn Kim Tín.
                    </Text>
                  </Text>
                </Column>
              </View>

              <Spacer size={2} />
              <Divider width={1.2} />

              <Column align="stretch" gap={6} style={styles.cardBody}>
                <Spacer size={4} />

                <View style={{ marginHorizontal: 24 }}>
                  {/* Username */}
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Column gap={6} align="stretch">
                        <Text
                          size={11}
                          weight="700"
                          color={colors.label}
                          style={styles.fieldLabel}
                        >
                          TÊN ĐĂNG NHẬP
                        </Text>
                        <Input
                          placeholder="Nhập tên đăng nhập"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          containerStyle={{ paddingHorizontal: 0 }}
                          inputContainerStyle={styles.inputContainer}
                          inputStyle={styles.inputText}
                          renderErrorMessage={false}
                        />
                        {errors.username?.message && (
                          <Text size={12} color={colors.error}>
                            {errors.username?.message}
                          </Text>
                        )}
                      </Column>
                    )}
                  />

                  <Spacer size={4} />

                  {/* Password */}
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Column gap={6} align="stretch">
                        <Text
                          size={11}
                          weight="700"
                          color={colors.label}
                          style={styles.fieldLabel}
                        >
                          MẬT KHẨU
                        </Text>
                        <Input
                          placeholder="Nhập mật khẩu"
                          secureTextEntry={!showPassword}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          containerStyle={{ paddingHorizontal: 0 }}
                          inputContainerStyle={styles.inputContainer}
                          inputStyle={styles.inputText}
                          renderErrorMessage={false}
                          rightIcon={
                            <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Icon
                                name={showPassword ? "eye" : "eye-off"}
                                type="feather"
                                size={17}
                                color={colors.label}
                              />
                            </TouchableOpacity>
                          }
                        />
                        {errors.password?.message && (
                          <Text size={12} color={colors.error}>
                            {errors.password?.message}
                          </Text>
                        )}
                      </Column>
                    )}
                  />
                </View>

                {/* Remember & Forgot */}
                <Row
                  justify="space-between"
                  align="center"
                  margin={[10, 12, 0, 12]}
                >
                  <TouchableOpacity
                    style={styles.checkRow}
                    onPress={() => setRememberUsername(!rememberUsername)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Icon
                      name={rememberUsername ? "check-square" : "square"}
                      type="feather"
                      size={16}
                      color={rememberUsername ? colors.active : colors.label}
                    />
                    <Text bold color={colors.label} style={{ marginLeft: 6 }}>
                      Lưu tên đăng nhập
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text size={14} weight="600" color={colors.active}>
                      Quên mật khẩu?
                    </Text>
                  </TouchableOpacity>
                </Row>

                <Spacer size={3} />
                <Divider width={2} />
                <Spacer size={0} />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit(onSubmit)}
                  style={[styles.submitContainer, styles.submitBtn]}
                >
                  <Text size={17} weight="700" color="#2D2E35">
                    ĐĂNG NHẬP
                  </Text>
                </TouchableOpacity>
              </Column>
            </View>
          </Animated.View>

          <Spacer size={12} />

          <Text size={12} color={colors.label} center>
            © Kim Tin Group
          </Text>

          <Spacer size={8} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Linear>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  shadowWrapper: {
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    backgroundColor: colors.white,
    borderRadius: 32,
  },
  loginCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#FEF9E7",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    borderRadius: 24,
    margin: 8,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: "hidden",
  },
  inputContainer: {
    backgroundColor: "#F2F2F4",
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1C1E",
  },
  fieldLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
    marginLeft: 4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitContainer: {
    marginTop: 16,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  submitBtn: {
    backgroundColor: "#FFEE70",
    height: 56,
    borderRadius: 16,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bgTopShape: {
    position: "absolute",
    top: -SCREEN_HEIGHT * 0.1,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 0.38,
    backgroundColor: colors.primary,
  },
  bgBottomShape: {
    position: "absolute",
    bottom: -SCREEN_HEIGHT * 0.08,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 0.35,
    backgroundColor: "#2D2E35",
  },
});

export default Login;
