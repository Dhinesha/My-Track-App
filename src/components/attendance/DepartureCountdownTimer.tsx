import { useEffect, useState } from 'react';
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { differenceInSeconds } from 'date-fns';

interface Props {
  departureISO: string | null;
  transportType?: "bus" | "flight" | "train" | "cab";
}

export function DepartureCountdownTimer({ departureISO, transportType = "bus" }: Props) {
  const [secsLeft, setSecsLeft] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!departureISO) return;
    const tick = () => {
      const s = differenceInSeconds(new Date(departureISO), new Date());
      setSecsLeft(s);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [departureISO]);

  useEffect(() => {
    if (secsLeft <= 0 || secsLeft > 900) { opacity.value = 1; return; }
    const speed = secsLeft <= 900 ? 400 : 800;
    opacity.value = withRepeat(withSequence(
      withTiming(0.4, { duration: speed }),
      withTiming(1, { duration: speed })
    ), -1);
  }, [secsLeft <= 0, secsLeft <= 900]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!departureISO) return null;

  const mins = Math.floor(Math.abs(secsLeft) / 60);
  const secs = Math.abs(secsLeft) % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const getDepartedText = () => {
    switch (transportType) {
      case "flight":
        return "Flight has departed — please check details";
      case "train":
        return "Train has departed — contact organiser";
      case "cab":
        return "Cab has departed — contact driver";
      case "bus":
      default:
        return "Bus has departed — contact your organiser if you are missing";
    }
  };

  const getUrgentText = () => {
    switch (transportType) {
      case "cab":
        return "Cab pickup soon — be ready!";
      case "flight":
        return "Board now!";
      case "train":
        return "Train departs soon — board now!";
      case "bus":
      default:
        return "Board now!";
    }
  };

  const getWarningText = () => {
    switch (transportType) {
      case "cab":
        return "Cab pickup soon — hurry up!";
      case "flight":
        return "Flight departs soon — hurry to gate!";
      case "train":
        return "Train departs soon — hurry up!";
      case "bus":
      default:
        return "Bus departs soon — hurry up!";
    }
  };

  const getNormalText = () => {
    switch (transportType) {
      case "cab":
        return "Cab pickup in";
      case "flight":
        return "Flight departs in";
      case "train":
        return "Train departs in";
      case "bus":
      default:
        return "Bus departs in";
    }
  };

  if (secsLeft <= 0) {
    return (
      <View style={[styles.departedContainer]}>
        <Text style={[styles.departedText]}>{getDepartedText()}</Text>
      </View>
    );
  }

  const isUrgent = secsLeft <= 900;
  const isWarning = secsLeft <= 1800;

  let containerStyle: any = styles.normalContainer;
  let textStyle: any = styles.normalText;
  let labelStyle: any = styles.normalLabel;

  if (isUrgent) {
    containerStyle = styles.urgentContainer;
    textStyle = styles.urgentText;
    labelStyle = styles.urgentLabel;
  } else if (isWarning) {
    containerStyle = styles.warningContainer;
    textStyle = styles.warningText;
    labelStyle = styles.warningLabel;
  }

  return (
    <Animated.View style={[animStyle, styles.baseContainer, containerStyle]}>
      <Text style={[styles.timeText, textStyle]}>
        {isUrgent ? '⚠️ ' : ''}{timeStr}
      </Text>
      <Text style={[styles.labelSubText, labelStyle]}>
        {isUrgent ? getUrgentText() : isWarning ? getWarningText() : getNormalText()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  departedContainer: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  departedText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    fontFamily: fonts.regular,},
  baseContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  normalContainer: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  warningContainer: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  urgentContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 1.2,
    fontFamily: fonts.bold,},
  normalText: {
    color: "#047857",
    fontFamily: fonts.regular,},
  warningText: {
    color: "#B45309",
    fontFamily: fonts.regular,},
  urgentText: {
    color: "#B91C1C",
    fontFamily: fonts.regular,},
  labelSubText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    fontFamily: fonts.medium,},
  normalLabel: {
    color: "#059669",
    fontFamily: fonts.regular,},
  warningLabel: {
    color: "#D97706",
    fontFamily: fonts.regular,},
  urgentLabel: {
    color: "#EF4444",
    fontFamily: fonts.regular,},
});
