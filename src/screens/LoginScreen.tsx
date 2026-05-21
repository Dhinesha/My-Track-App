import React, { useState, useEffect, useRef } from "react";
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
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuthStore } from "../store/authStore";
import TrackMyTripLogo from "../components/shared/TrackMyTripLogo";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';

const CORRECT_OTP = "1234";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  console.log("LoginScreen: Rendering component...");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Countdown timer after OTP sent
  useEffect(() => {
    if (!showOtp) return;
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [showOtp, timer]);

  const handleGetOtp = () => {
    if (phone.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowOtp(true);
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }, 900);
  };

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < 3) otpRefs[index + 1].current?.focus();
    if (digit && index === 3) {
      const full = next.join("");
      if (full.length === 4) handleVerify(full);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (code?: string) => {
    const full = code ?? otp.join("");
    if (full.length < 4) return;
    setIsVerifying(true);
    setError("");
    setTimeout(() => {
      setIsVerifying(false);
      if (full === CORRECT_OTP) {
        useAuthStore.getState().setUser({
          id: "u-101",
          name: "Demo Traveler",
          mobile: phone,
          role: "traveler",
          onboarding_complete: false,
        });
        navigation.replace("Onboarding");
      } else {
        setError("Incorrect OTP. Please try again.");
        setOtp(["", "", "", ""]);
        otpRefs[0].current?.focus();
      }
    }, 1200);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={s.safe}>

            {/* HEADER: logo + app name */}
            <View style={s.header}>
              <TrackMyTripLogo size={56} />
              <Text style={s.appName}>MyTripGuide</Text>
            </View>

            {/* BODY */}
            <View style={s.body}>

              {/* Title */}
              <Text style={s.heading}>Login</Text>
              <Text style={s.subheading}>Enter your details to access your trips</Text>

              {/* Mobile Number */}
              <Text style={s.label}>Mobile Number</Text>
              <View style={s.phoneRow}>
                {/* Country code */}
                <View style={[s.countryBox, Shadows.sm]}>
                  <Text style={s.flagEmoji}>🇮🇳</Text>
                  <Text style={s.countryCode}>+91</Text>
                </View>
                {/* Phone input */}
                <TextInput
                  style={[
                    s.phoneInput, 
                    Shadows.sm,
                    isPhoneFocused && s.phoneInputFocused
                  ]}
                  placeholder="Enter mobile number"
                  placeholderTextColor={Colors.neutral.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(v) => {
                    setPhone(v.replace(/[^0-9]/g, "").slice(0, 10));
                    if (error) setError("");
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  maxLength={10}
                  returnKeyType="done"
                  onSubmitEditing={handleGetOtp}
                  editable={!showOtp}
                />
              </View>

              {/* Error (phone step) */}
              {!showOtp && !!error && (
                <Text style={s.errorText}>{error}</Text>
              )}

              {/* GET OTP BUTTON */}
              {!showOtp && (
                <TouchableOpacity
                  style={[s.btn, phone.length < 10 && s.btnDisabled, Shadows.md]}
                  onPress={handleGetOtp}
                  disabled={phone.length < 10 || isSending}
                  activeOpacity={0.85}
                >
                  {isSending
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Get OTP</Text>
                  }
                </TouchableOpacity>
              )}

              {/* VERIFICATION SECTION */}
              {showOtp && (
                <>
                  {/* VERIFICATION divider */}
                  <View style={s.divRow}>
                    <View style={s.divLine} />
                    <Text style={s.divLabel}>VERIFICATION</Text>
                    <View style={s.divLine} />
                  </View>

                  {/* OTP label */}
                  <Text style={s.otpLabel}>Enter Verification Code</Text>

                  {/* 4 OTP BOXES */}
                  <View style={s.otpRow}>
                    {otp.map((digit, i) => (
                      <View key={i} style={s.otpWrapper}>
                        <TextInput
                          ref={otpRefs[i]}
                          style={[
                            s.otpBox, 
                            digit ? s.otpBoxActive : s.otpBoxEmpty,
                            Shadows.sm
                          ]}
                          value={digit}
                          onChangeText={(t) => handleOtpChange(t, i)}
                          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          selectTextOnFocus
                          caretHidden
                        />
                      </View>
                    ))}
                  </View>

                  {/* Sent to / Resend row */}
                  <View style={s.metaRow}>
                    <Text style={s.sentTo}>Sent to +91 {phone}</Text>
                    <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                      <Text style={[s.resend, !canResend && s.resendDisabled]}>
                        Resend Code ({timer}s)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Error (OTP step) */}
                  {!!error && (
                    <Text style={[s.errorText, { textAlign: "center", marginBottom: 12 }]}>
                      {error}
                    </Text>
                  )}

                  {/* VERIFY OTP BUTTON */}
                  <TouchableOpacity
                    style={[s.btn, (otp.join("").length < 4 || isVerifying) && s.btnDisabled, Shadows.md]}
                    onPress={() => handleVerify()}
                    disabled={otp.join("").length < 4 || isVerifying}
                    activeOpacity={0.85}
                  >
                    {isVerifying
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={s.btnText}>Verify OTP</Text>
                    }
                  </TouchableOpacity>

                  {/* Footer note */}
                  <Text style={s.footerNote}>Only primary traveller can login</Text>
                </>
              )}
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* Styles */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  safe: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 8,
  },
  appName: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "700",
    color: Colors.primary.main,
    fontFamily: fonts.bold,
    letterSpacing: -0.5,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
    marginBottom: 10,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
    gap: 6,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  flagEmoji: {
    fontSize: 18,
    fontFamily: fonts.regular,},
  countryCode: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.regular,
  },
  phoneInputFocused: {
    borderColor: Colors.primary.main,
    borderWidth: 1.5,
  },
  btn: {
    backgroundColor: Colors.primary.main,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnDisabled: {
    backgroundColor: Colors.neutral.textMuted,
    opacity: 0.6,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: fonts.bold,
  },
  divRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
    gap: 10,
  },
  divLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.neutral.border,
  },
  divLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
    letterSpacing: 2,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  otpWrapper: {
    flex: 1,
    height: 64,
  },
  otpBox: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: fonts.bold,
    color: Colors.neutral.textPrimary,
    textAlign: "center",
    padding: 0,
    ...Platform.select({
      web: {
        lineHeight: 60,
      },
    }),
  },
  otpBoxEmpty: {
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  otpBoxActive: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 2,
  },
  sentTo: {
    fontSize: 12,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
  resend: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary.main,
    fontFamily: fonts.semiBold,
  },
  resendDisabled: {
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,},
  footerNote: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  errorText: {
    color: Colors.urgent.main,
    fontSize: 12,
    fontFamily: fonts.regular,
    marginBottom: 12,
    marginLeft: 2,
  },
});
