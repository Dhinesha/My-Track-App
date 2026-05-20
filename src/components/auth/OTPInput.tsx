import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
  Platform,
} from "react-native";

interface AuthOTPInputProps {
  onChange: (otp: string) => void;
}

export function AuthOTPInput({ onChange }: AuthOTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length === 6 && /^\d{6}$/.test(text)) {
      const newVals = text.split("");
      setValues(newVals);
      onChange(text);
      inputs.current[5]?.focus();
      return;
    }

    const digit = text.slice(-1);
    if (!/^\d?$/.test(digit)) return;

    const newVals = [...values];
    newVals[index] = digit;
    setValues(newVals);

    if (digit && index < 5) inputs.current[index + 1]?.focus();
    if (newVals.every(Boolean)) onChange(newVals.join(""));
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-3 justify-center my-6">
      {values.map((val, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            inputs.current[i] = r;
          }}
          value={val}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="numeric"
          maxLength={1}
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            ...(Platform.OS === "web"
              ? {
                  boxShadow: val
                    ? "0 2px 4px rgba(13, 148, 136, 0.2)"
                    : "0 2px 4px rgba(0, 0, 0, 0.05)",
                }
              : {
                  shadowColor: val ? "#0D9488" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: val ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }),
          }}
          className={`w-12 h-16 text-center text-2xl font-bold rounded-2xl border-2
            ${val ? "border-teal-600 bg-teal-50 text-teal-900" : "border-gray-200 bg-white text-gray-400"}`}
        />
      ))}
    </View>
  );
}
