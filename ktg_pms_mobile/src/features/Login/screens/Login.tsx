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
import { VersionInfo } from "~/components";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "~/constants";
import { useTheme } from "~/hooks/useTheme";
import { STORAGE_KEYS } from "~/constants/storage";
import useLogin from "~/hooks/useLogin";
import { useToast } from "~/hooks/useToast";
import { useWaiting } from "~/hooks/useWaiting";
import StorageHelper from "~/utils/storage";
import ValidateHelper, { LoginSchema } from "~/utils/validation";
import { useAuth } from "~/hooks/useAuth";
import {
  CompanyPickerSheet,
  CompanyPickerSheetHandle,
} from "../components/CompanyPickerSheet";
import { authService } from "~/services/auth/auth.service";

type FormData = LoginSchema;

const Login = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isSmallScreen = SCREEN_HEIGHT < 750;
  const { start, stop } = useWaiting();
  const isFocused = useIsFocused();
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin } = useLogin();
  const { user, onSetUser } = useAuth();
  const { showToast } = useToast();
  const [rememberUsername, setRememberUsername] = useState(true);
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const topShapeY = useRef(new Animated.Value(-200)).current;
  const bottomShapeY = useRef(new Animated.Value(200)).current;
  const companyPickerRef = useRef<CompanyPickerSheetHandle>(null);

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
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bottomShapeY, {
          toValue: 0,
          duration: 150,
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
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      start();
      await onLogin({ username: data.username, password: data.password });
    } finally {
      stop();
    }
  };

  useEffect(() => {
    if (user && user.listCompany && user.listCompany.length > 1) {
      companyPickerRef.current?.open();
    }
  }, [user]);

  const handleSelectCompany = async (companyId: string) => {
    try {
      await authService.updateCompany(companyId);
      await onSetUser({ ...user!, companyId });
    } catch (e) {
      showToast({ type: "danger", message: "Không thể chọn công ty" });
    }
  };

  return (
    <Linear>
      {/* Background Shapes */}
      <Animated.View
        style={[
          styles.bgTopShape,
          {
            transform: [{ translateY: topShapeY }],
            backgroundColor: colors.goldShape as string,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bgBottomShape,
          {
            transform: [{ translateY: bottomShapeY }],
            backgroundColor: colors.neutral100 as string,
          },
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
              {
                paddingTop: insets.top,
                height: isSmallScreen
                  ? SCREEN_HEIGHT * 0.22
                  : SCREEN_HEIGHT * 0.26,
              },
            ]}
          >
            <Image
              source={Images.logo}
              style={[
                styles.logoImage,
                isSmallScreen && { width: 80, height: 80 },
              ]}
              resizeMode="contain"
            />
          </View>

          <Animated.View
            style={[
              styles.shadowWrapper,
              {
                transform: [{ translateY }],
                opacity,
                backgroundColor: colors.card as string,
              },
            ]}
          >
            <View
              style={[
                styles.loginCard,
                {
                  backgroundColor: colors.neutral50 as string,
                  borderColor: colors.blackAlpha3 as string,
                },
              ]}
            >
              <View
                style={[
                  styles.cardHeader,
                  { backgroundColor: colors.goldCream as string },
                ]}
              >
                <Column align="stretch" gap={6}>
                  {/* Title — một màu đen, không tách vàng/đen */}
                  <Text
                    size={isSmallScreen ? 20 : 24}
                    weight="800"
                    color={colors.neutral900}
                  >
                    Đăng nhập
                  </Text>
                  <Text
                    size={isSmallScreen ? 24 : 28}
                    weight="900"
                    color={colors.amber400}
                  >
                    Tài khoản
                    <Text
                      label
                      weight="600"
                      size={isSmallScreen ? 14 : 15}
                      color={colors.label}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {"  "}
                      Tập đoàn Kim Tín.
                    </Text>
                  </Text>
                </Column>
              </View>

              <Spacer size={isSmallScreen ? 1 : 2} />
              <Divider width={1.2} />

              <Column align="stretch" gap={6} style={styles.cardBody}>
                <Spacer size={isSmallScreen ? 2 : 4} />

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
                          inputContainerStyle={[
                            styles.inputContainer,
                            { backgroundColor: colors.neutral100 as string },
                          ]}
                          inputStyle={[
                            styles.inputText,
                            { color: colors.neutral900 as string },
                          ]}
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

                  <Spacer size={isSmallScreen ? 2 : 4} />

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
                          inputContainerStyle={[
                            styles.inputContainer,
                            { backgroundColor: colors.neutral100 as string },
                          ]}
                          inputStyle={[
                            styles.inputText,
                            { color: colors.neutral900 as string },
                          ]}
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
                                color={colors.label as string}
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
                  margin={[isSmallScreen ? 6 : 10, 12, 0, 12]}
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
                      color={
                        (rememberUsername
                          ? colors.active
                          : colors.label) as string
                      }
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

                <Spacer size={isSmallScreen ? 2 : 3} />
                <Divider width={2} />
                <Spacer size={0.5} />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit(onSubmit)}
                  style={[
                    styles.submitContainer,
                    styles.submitBtn,
                    {
                      backgroundColor: colors.goldPrimary as string,
                      shadowColor: colors.goldShadow as string,
                    },
                  ]}
                >
                  <Text size={17} weight="700" color={colors.neutral800}>
                    ĐĂNG NHẬP
                  </Text>
                </TouchableOpacity>
              </Column>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <VersionInfo />

      {user?.listCompany && (
        <CompanyPickerSheet
          ref={companyPickerRef}
          listCompany={user.listCompany}
          onSelect={handleSelectCompany}
        />
      )}
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
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderRadius: 32,
  },
  loginCard: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_HEIGHT < 750 ? 24 : 32,
    paddingBottom: SCREEN_HEIGHT < 750 ? 16 : 20,
    borderRadius: 24,
    margin: SCREEN_HEIGHT < 750 ? 4 : 8,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: "hidden",
  },
  inputContainer: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 15,
    fontWeight: "600",
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
    height: 56,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bgTopShape: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * (SCREEN_HEIGHT < 750 ? 0.4 : 0.45),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bgBottomShape: {
    position: "absolute",
    left: 0,
    width: SCREEN_WIDTH,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: "#ffffff",
  },
});

export default Login;
