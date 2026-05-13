import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import { Colors } from "../theme/colors";
import { useAuthStore } from "../store/authStore";
import { Button, OTPInput } from "../components/common";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showOtp, setShowOtp] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtp && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const handleGetOtp = () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    // Starts with 6/7/8/9
    if (!/^[6-9]/.test(phone)) {
      setError("Enter a valid Indian mobile number starting with 6-9");
      return;
    }

    setIsSendingOtp(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsSendingOtp(false);
      setShowOtp(true);
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    }, 1200);
  };

  const handleVerifyOtp = (code?: string) => {
    const fullCode = code || otp.join("");
    if (fullCode.length !== 6) return;

    setIsValidating(true);
    setError("");

    // Simulate verification
    setTimeout(() => {
      setIsValidating(false);
      if (fullCode === "123456") {
        useAuthStore.getState().setUser({
          id: "u-101",
          name: "Demo Traveler",
          mobile: phone,
          role: "traveler",
        });
        navigation.replace("Onboarding");
      } else {
        setError("Incorrect OTP. Please try again.");
        setOtp(Array(6).fill(""));
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    handleGetOtp();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SafeAreaView className="flex-1 px-8 pt-10">
            {/* Header / Logo */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4">
                <MaterialCommunityIcons
                  name="bus-side"
                  size={48}
                  color={Colors.primary}
                />
              </View>
              <Text className="text-3xl font-jakarta-extrabold text-primary">
                MyTripGuide
              </Text>
              <Text className="text-text-secondary font-jakarta-medium text-sm mt-1">
                Your journey, simplified
              </Text>
            </View>

            {/* Content Section */}
            <View className="flex-1">
              {!showOtp ? (
                <View>
                  <Text className="text-2xl font-jakarta-bold text-text-primary mb-2">
                    Welcome back!
                  </Text>
                  <Text className="text-text-secondary font-jakarta-regular mb-8">
                    Enter your mobile number to get started.
                  </Text>

                  <View className="mb-6">
                    <Text className="text-sm font-jakarta-semibold text-text-primary mb-2">
                      Mobile Number
                    </Text>
                    <View className="flex-row items-center bg-background-input border border-border-light rounded-xl px-4 h-14">
                      <View className="flex-row items-center border-r border-border-light pr-3 mr-3">
                        <Text className="text-lg mr-1">🇮🇳</Text>
                        <Text className="text-base font-jakarta-bold text-text-primary">
                          +91
                        </Text>
                      </View>
                      <TextInput
                        className="flex-1 text-lg font-jakarta-medium text-text-primary"
                        placeholder="00000 00000"
                        placeholderTextColor={Colors.text.muted}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={(val) => {
                          setPhone(val.replace(/[^0-9]/g, "").slice(0, 10));
                          if (error) setError("");
                        }}
                        maxLength={10}
                      />
                    </View>
                    {error ? (
                      <Text className="text-status-error text-xs font-jakarta-medium mt-2 ml-1">
                        {error}
                      </Text>
                    ) : null}
                  </View>

                  <Button
                    label="Get Verification Code"
                    onPress={handleGetOtp}
                    variant="teal"
                    size="lg"
                    fullWidth
                    loading={isSendingOtp}
                    disabled={phone.length < 10}
                    rightIcon={
                      <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color="#fff"
                      />
                    }
                  />
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => setShowOtp(false)}
                    className="flex-row items-center mb-6"
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text className="text-primary font-jakarta-bold ml-1">
                      Change Number
                    </Text>
                  </TouchableOpacity>

                  <Text className="text-2xl font-jakarta-bold text-text-primary mb-2">
                    Verify Code
                  </Text>
                  <Text className="text-text-secondary font-jakarta-regular mb-8">
                    We've sent a 6-digit code to{" "}
                    <Text className="font-jakarta-bold text-text-primary">
                      +91 {phone}
                    </Text>
                  </Text>

                  <View className="mb-8">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleVerifyOtp}
                    />
                    {error ? (
                      <Text className="text-status-error text-center text-sm font-jakarta-medium mt-4">
                        {error}
                      </Text>
                    ) : null}
                  </View>

                  <Button
                    label="Verify and Continue"
                    onPress={() => handleVerifyOtp()}
                    variant="teal"
                    size="lg"
                    fullWidth
                    loading={isValidating}
                    disabled={otp.join("").length < 6}
                  />

                  <View className="items-center mt-8">
                    <Text className="text-text-secondary font-jakarta-medium mb-2">
                      Didn't receive code?
                    </Text>
                    <TouchableOpacity
                      onPress={handleResend}
                      disabled={!canResend}
                    >
                      <Text
                        className={`font-jakarta-extrabold ${canResend ? "text-primary underline" : "text-text-muted"}`}
                      >
                        {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View className="items-center pb-8 mt-auto">
              <Text className="text-text-muted text-xs font-jakarta-medium text-center">
                By continuing, you agree to MyTripGuide's{"\n"}
                <Text className="text-primary underline">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-primary underline">Privacy Policy</Text>
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
