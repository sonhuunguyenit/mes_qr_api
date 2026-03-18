import { Input as RNInput, InputProps as RNInputProps } from "@rneui/themed";
import React, { forwardRef } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useTheme } from "~/hooks/useTheme";

import { StyleProp } from "react-native";

interface InputProps extends RNInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  validate?: boolean;
}

import { sizes } from "~/constants/sizes";

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      editable = true,
      validate,
      ...props
    },
    ref,
  ) => {
    const { colors, fonts, radius, spacing } = useTheme();

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      props.onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      props.onBlur?.(e);
    };

    return (
      <RNInput
        {...props}
        ref={ref}
        containerStyle={[styles.container, containerStyle]}
        inputContainerStyle={[
          {
            height: 50,
            borderWidth: 1,
            borderColor: props.errorMessage ? colors.error : colors.border,
            borderRadius: radius.input,
            backgroundColor: colors.card,
            paddingHorizontal: spacing.sm,
          },
          !editable && { backgroundColor: colors.disabledBg },
          props?.inputContainerStyle,
        ]}
        inputStyle={[
          {
            fontFamily: fonts.regular,
            color: colors.value,
            fontSize: sizes.fontSize.base,
          },
          inputStyle,
        ]}
        labelStyle={[
          {
            fontFamily: fonts.medium,
            color: colors.label,
            fontSize: sizes.fontSize.base,
            marginBottom: 8,
          },
          labelStyle,
        ]}
        errorStyle={[
          {
            color: colors.error,
            fontSize: sizes.fontSize.xs, // Error nhỏ hơn 1 bit (12px)
            marginTop: spacing.xs,
          },
          errorStyle,
        ]}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errorMessage={props.errorMessage}
        renderErrorMessage={validate ?? !!props.errorMessage}
        rightIcon={
          props.rightIcon ||
          (!!props.value && !!props.onChangeText && editable ? (
            <TouchableOpacity onPress={() => props.onChangeText?.("")}>
              <Icon
                name="close-circle-outline"
                type="ionicon"
                size={20}
                color={colors.placeholder}
              />
            </TouchableOpacity>
          ) : undefined)
        }
      />
    );
  },
);

import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "@rneui/base";

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
  },
});
