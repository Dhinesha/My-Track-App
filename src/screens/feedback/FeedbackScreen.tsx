import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { RootStackParamList } from "../../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FeedbackRoute = RouteProp<
  {
    Feedback: { tripId: string; tripName: string; paxId: string };
  },
  "Feedback"
>;

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation<Nav>();
  const route = useRoute<FeedbackRoute>();
  const { tripId, tripName } = route.params;

  const skip = async () => {
    await AsyncStorage.setItem(`feedback_skipped_${tripId}`, "true");
    navigation.replace("Main");
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      await AsyncStorage.setItem(
        `feedback_${tripId}`,
        JSON.stringify({
          tripId,
          rating,
          comment: comment.trim() || null,
          submittedAt: new Date().toISOString(),
        }),
      );

      setShowSuccess(true);
    } catch (error) {
      Alert.alert("Error", "Could not save feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successCircle}>
            <MaterialIcons name="check" size={60} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMsg}>
            Your feedback for {tripName} has been successfully submitted.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace("Main")}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Feedback</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.tripName}>{tripName}</Text>
        <Text style={styles.subtitle}>How was your trip experience?</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.star,
                  star <= rating ? styles.starFilled : styles.starEmpty,
                ]}
              >
                {star <= rating ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.commentWrap}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            maxLength={500}
            placeholder="Any comments? (optional)"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            style={styles.commentInput}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{comment.length}/500</Text>
        </View>

        <TouchableOpacity
          onPress={submit}
          disabled={rating === 0 || submitting}
          activeOpacity={0.85}
          style={[
            styles.submitButton,
            rating > 0
              ? styles.submitButtonActive
              : styles.submitButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.submitText,
              rating > 0 ? styles.submitTextActive : styles.submitTextDisabled,
            ]}
          >
            {submitting ? "Saving..." : "Submit Feedback"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={skip}
          style={styles.skipButton}
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  tripName: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontFamily: "PlusJakartaSans-Regular",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  star: {
    fontSize: 40,
  },
  starFilled: {
    color: "#F59E0B",
  },
  starEmpty: {
    color: "#CBD5E1",
  },
  commentWrap: {
    gap: 8,
  },
  commentInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: Colors.text.primary,
  },
  counter: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: "right",
    fontFamily: "PlusJakartaSans-Regular",
  },
  submitButton: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonActive: {
    backgroundColor: Colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: "#E2E8F0",
  },
  submitText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
  submitTextActive: {
    color: "#FFFFFF",
  },
  submitTextDisabled: {
    color: "#94A3B8",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    color: Colors.text.muted,
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "PlusJakartaSans-Medium",
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
    textAlign: "center",
  },
  successMsg: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Regular",
    paddingHorizontal: 20,
  },
  doneButton: {
    marginTop: 12,
    paddingHorizontal: 32,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
