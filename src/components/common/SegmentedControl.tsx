import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onOptionPress: (index: number) => void;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onOptionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            index === selectedIndex && styles.optionSelected,
            index === 0 && styles.optionFirst,
            index === options.length - 1 && styles.optionLast,
          ]}
          onPress={() => onOptionPress(index)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.optionContent,
              {
                backgroundColor:
                  index === selectedIndex ? Colors.primary : "transparent",
              },
            ]}
          >
            <Text
              style={[
                {
                  color:
                    index === selectedIndex
                      ? Colors.white
                      : Colors.text.secondary,
                  fontFamily: "PlusJakartaSans-SemiBold",
                  fontSize: 12,
                },
              ]}
            >
              {option}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: 2,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: Colors.white,
  },
  optionFirst: {
    borderTopLeftRadius: Radius.md,
    borderBottomLeftRadius: Radius.md,
  },
  optionLast: {
    borderTopRightRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
  },
  optionContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
