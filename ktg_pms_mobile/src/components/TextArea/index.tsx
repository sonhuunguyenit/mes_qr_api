import React, { forwardRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "~/hooks/useTheme";
import { Input } from "~/common";

export interface TextAreaProps extends React.ComponentProps<typeof Input> {}

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ inputContainerStyle, inputStyle, ...props }, ref) => {
    const { colors } = useTheme();

    return (
      <Input
        {...props}
        ref={ref}
        multiline
        inputContainerStyle={[
          {
            height: undefined,
            minHeight: 60,
            borderWidth: 0.5,
            borderColor: colors.border,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: "flex-start",
          },
          inputContainerStyle,
        ]}
        inputStyle={[
          {
            minHeight: 60,
            textAlignVertical: "top",
            paddingTop: 0,
            fontSize: 14,
          },
          inputStyle,
        ]}
      />
    );
  },
);

export default TextArea;
