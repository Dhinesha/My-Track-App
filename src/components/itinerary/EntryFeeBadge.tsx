import { View, Text, StyleSheet } from "react-native";

interface Props {
  type: "free" | "agency" | "self";
  amount?: number;
}

export function EntryFeeBadge({ type, amount }: Props) {
  const config = {
    free: {
      bgColor: "#F0FDF4",
      borderColor: "#BBF7D0",
      textColor: "#15803D",
      label: "Free Entry",
    },
    agency: {
      bgColor: "#F0FDFA",
      borderColor: "#99F6E4",
      textColor: "#0F766E",
      label: "Agency Sponsored · Included",
    },
    self: {
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
      textColor: "#B45309",
      label: `Self Pay · ₹${amount ?? ""}`,
    },
  }[type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bgColor, borderColor: config.borderColor },
      ]}
    >
      <Text style={[styles.text, { color: config.textColor }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
