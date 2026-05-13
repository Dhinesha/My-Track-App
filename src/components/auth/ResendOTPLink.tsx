import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  onResend: () => void;
}

export function ResendOTPLink({ onResend }: Props) {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const timeoutId = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [seconds]);

  const handleResend = () => {
    onResend();
    setSeconds(30);
  };

  if (seconds > 0) {
    return (
      <Text className="mt-4 text-center text-sm text-gray-400">
        Resend OTP in{" "}
        <Text className="font-semibold text-gray-600">{seconds}s</Text>
      </Text>
    );
  }

  return (
    <TouchableOpacity onPress={handleResend} className="mt-4">
      <Text className="text-center text-sm font-semibold text-teal-600 underline">
        Resend OTP
      </Text>
    </TouchableOpacity>
  );
}
