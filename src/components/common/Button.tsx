import React from "react";
import { fonts, textStyles } from '../../constants/theme';
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost"
  | "teal";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  textClassName = "",
  leftIcon,
  rightIcon,
  style,
}) => {
  const isDisabled = disabled || loading;

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-secondary shadow-lg shadow-secondary/30";
      case "teal":
        return "bg-primary shadow-lg shadow-primary/30";
      case "secondary":
        return "bg-white border border-border-light shadow-sm";
      case "danger":
        return "bg-status-error shadow-lg shadow-status-error/30";
      case "outline":
        return "bg-transparent border-2 border-primary";
      case "ghost":
        return "bg-transparent";
      default:
        return "bg-primary";
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case "primary":
      case "teal":
      case "danger":
        return "text-white";
      case "secondary":
      case "outline":
      case "ghost":
        return "text-primary";
      default:
        return "text-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-9 px-4";
      case "md":
        return "h-12 px-6";
      case "lg":
        return "h-14 px-8";
      default:
        return "h-12 px-6";
    }
  };

  const getFontSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={style}
      className={`
        flex-row items-center justify-center rounded-xl
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60" : ""}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "secondary" ||
            variant === "outline" ||
            variant === "ghost"
              ? "#2B8CEE"
              : "#FFFFFF"
          }
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className={`
              font-jakarta-bold
              ${getTextVariantClasses()}
              ${getFontSizeClasses()}
              ${textClassName}
            `}
          >
            {label}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
