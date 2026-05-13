import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, NativeEventEmitter, Platform } from "react-native";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
}) => {
  const inputRefs = useRef<TextInput[]>([]);

  const handleTextChange = (text: string, index: number) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, "");
    if (!cleanText && text) return;

    const newValue = [...value];

    // Handle paste
    if (cleanText.length > 1) {
      const pasteData = cleanText.slice(0, length).split("");
      const updatedValue = [...value];
      pasteData.forEach((char, i) => {
        if (i < length) updatedValue[i] = char;
      });
      onChange(updatedValue);

      // Focus last filled box or next empty
      const nextIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      if (updatedValue.join("").length === length) {
        onComplete?.(updatedValue.join(""));
      }
      return;
    }

    newValue[index] = cleanText;
    onChange(newValue);

    if (cleanText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue.join("").length === length) {
      onComplete?.(newValue.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between w-full px-1">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
          className={`
            w-12 h-14 bg-background-input rounded-xl border-2 text-center text-xl font-jakarta-bold text-text-primary
            ${value[index] ? "border-primary bg-white" : "border-border-light"}
          `}
          value={value[index]}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={index === 0 ? length : 1} // Support paste on first box
          selectTextOnFocus
        />
      ))}
    </View>
  );
};
