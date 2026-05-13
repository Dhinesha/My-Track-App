import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  errorText?: string;
  disabled?: boolean;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "decimal-pad";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  showCharCount?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  errorText,
  disabled = false,
  editable = true,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  showCharCount = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const hasError = error || errorText;

  const borderColor = hasError
    ? Colors.status.error
    : isFocused
      ? Colors.primary
      : Colors.border.light;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[Typography.bodyMedium, styles.label]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={20}
            color={isFocused ? Colors.primary : Colors.text.secondary}
            style={styles.leftIcon}
          />
        )}

        <RNTextInput
          style={[
            styles.input,
            inputStyle,
            leftIcon && { marginLeft: 0 },
            rightIcon && { marginRight: 0 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          editable={editable && !disabled}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <MaterialCommunityIcons
              name={rightIcon as any}
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {showCharCount && maxLength && (
        <Text style={[Typography.subText, styles.charCount]}>
          {value.length}/{maxLength}
        </Text>
      )}

      {hasError && (
        <Text style={[Typography.subText, styles.errorText]}>
          {errorText || error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.background.input,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: Colors.text.primary,
  },
  leftIcon: {
    marginRight: Spacing.md,
  },
  rightIcon: {
    marginLeft: Spacing.md,
    padding: Spacing.sm,
  },
  errorText: {
    color: Colors.status.error,
    marginTop: Spacing.sm,
  },
  charCount: {
    marginTop: Spacing.sm,
    textAlign: "right",
  },
});
