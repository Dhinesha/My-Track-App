/**
 * Navigation utilities and helpers
 */

import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

export type RootNavigation = NavigationProp<RootStackParamList>;

/**
 * Navigate to trip detail screen
 */
export const navigateToTrip = (
  navigation: RootNavigation,
  tripId: string,
  tripName: string,
) => {
  navigation.navigate("TripDetail", { tripId, tripName });
};

/**
 * Navigate to itinerary screen
 */
export const navigateToItinerary = (
  navigation: RootNavigation,
  tripId: string,
  tripName: string,
) => {
  navigation.navigate("Itinerary", { tripId, tripName });
};

/**
 * Navigate to login screen
 */
export const navigateToLogin = (navigation: RootNavigation) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

/**
 * Navigate to home screen
 */
export const navigateToHome = (navigation: RootNavigation) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Main" }],
  });
};
