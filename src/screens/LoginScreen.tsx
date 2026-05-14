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

const PRIMARY = "#2b8cee";
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

            {/* ── HEADER: logo + app name ── */}
            <View style={s.header}>
              <TrackMyTripLogo size={52} />
              <Text style={s.appName}>My Trip Guide</Text>
            </View>

            {/* ── BODY ── */}
            <View style={s.body}>

              {/* Title */}
              <Text style={s.heading}>Login</Text>
              <Text style={s.subheading}>Enter your details to access your trips</Text>

              {/* ── Mobile Number ── */}
              <Text style={s.label}>Mobile Number</Text>
              <View style={s.phoneRow}>
                {/* Country code */}
                <View style={s.countryBox}>
                  <Text style={s.flagEmoji}>🇮🇳</Text>
                  <Text style={s.countryCode}>+91</Text>
                </View>
                {/* Phone input */}
                <TextInput
                  style={s.phoneInput}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(v) => {
                    setPhone(v.replace(/[^0-9]/g, "").slice(0, 10));
                    if (error) setError("");
                  }}
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

              {/* ── GET OTP BUTTON (step 1 only) ── */}
              {!showOtp && (
                <TouchableOpacity
                  style={[s.btn, phone.length < 10 && s.btnDisabled]}
                  onPress={handleGetOtp}
                  disabled={phone.length < 10 || isSending}
                  activeOpacity={0.85}
                >
                  {isSending
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Get OTP →</Text>
                  }
                </TouchableOpacity>
              )}

              {/* ── VERIFICATION SECTION (step 2) ── */}
              {showOtp && (
                <>
                  {/* ── VERIFICATION divider ── */}
                  <View style={s.divRow}>
                    <View style={s.divLine} />
                    <Text style={s.divLabel}>VERIFICATION</Text>
                    <View style={s.divLine} />
                  </View>

                  {/* OTP label */}
                  <Text style={s.otpLabel}>Enter Verification Code</Text>

                  {/* ── 4 OTP BOXES ── */}
                  <View style={s.otpRow}>
                    {otp.map((digit, i) => (
                      <View key={i} style={s.otpWrapper}>
                        <TextInput
                          ref={otpRefs[i]}
                          style={[s.otpBox, digit ? s.otpBoxActive : s.otpBoxEmpty]}
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
                    <Text style={s.sentTo}>Sent to {phone}</Text>
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

                  {/* ── VERIFY OTP BUTTON ── */}
                  <TouchableOpacity
                    style={[s.btn, (otp.join("").length < 4 || isVerifying) && s.btnDisabled]}
                    onPress={() => handleVerify()}
                    disabled={otp.join("").length < 4 || isVerifying}
                    activeOpacity={0.85}
                  >
                    {isVerifying
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={s.btnText}>Verify OTP 🔒</Text>
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

/* ─── Styles ─────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safe: {
    flex: 1,
  },

  /* Header */
  header: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 4,
  },
  appName: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: PRIMARY,
    fontFamily: "PlusJakartaSans-ExtraBold",
    letterSpacing: -0.3,
  },

  /* Body */
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
  },

  /* Login title */
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    fontFamily: "PlusJakartaSans-ExtraBold",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 24,
  },

  /* Phone label */
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 10,
  },

  /* Phone row */
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 54,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  flagEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "PlusJakartaSans-Bold",
  },
  phoneInput: {
    flex: 1,
    height: 54,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
    fontFamily: "PlusJakartaSans-Medium",
  },

  /* Primary button */
  btn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: 0.2,
  },

  /* Divider */
  divRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    gap: 10,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  divLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: 2.5,
  },

  /* OTP */
  otpLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  /* flex:1 lives on the wrapper View — TextInput fills it 100% */
  otpWrapper: {
    flex: 1,
    height: 72,
  },
  otpBox: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans-Bold",
    color: "#0f172a",
    textAlignVertical: "center",
    textAlign: "center",
  },
  otpBoxEmpty: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  otpBoxActive: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY,
  },

  /* Meta row */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  sentTo: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "PlusJakartaSans-Regular",
  },
  resend: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  resendDisabled: {
    color: "#94a3b8",
  },

  /* Footer */
  footerNote: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "PlusJakartaSans-Regular",
  },

  /* Error */
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 10,
    marginLeft: 2,
  },
});
