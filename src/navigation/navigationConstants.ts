/**
 * Navigation route names and constants
 */

export const RootNavigationNames = {
  // Auth Stack
  SPLASH: "Splash",
  LOGIN: "Login",

  // App Stack
  MAIN: "Main",
  TRIP_DETAIL: "TripDetail",
  ITINERARY: "Itinerary",
  HOTEL: "Hotel",
  VEHICLE_ATTENDANCE: "VehicleAttendance",
  FAMILY_MEMBERS: "FamilyMembers",
  NOTIFICATIONS: "Notifications",
  ADMIN_DASHBOARD: "AdminDashboard",
  PROFILE: "Profile",
  EMERGENCY: "Emergency",
  FEEDBACK: "Feedback",
  ONBOARDING: "Onboarding",
} as const;

export const BottomTabNames = {
  DASHBOARD: "Dashboard",
  ITINERARY: "Itinerary",
  ATTENDANCE: "Attendance",
  HOTEL: "Hotel",
  NOTIFICATIONS: "Notifications",
} as const;

export const DrawerNames = {
  PROFILE: "Profile",
  EMERGENCY: "Emergency",
  FEEDBACK: "Feedback",
  LOGOUT: "Logout",
} as const;

/**
 * Deep link prefixes
 */
export const DeepLinkPrefixes = ["mytrip://", "exp://trip/"];

/**
 * Deep link paths
 */
export const DeepLinkPaths = {
  TRIP: "trip/:id",
  ITINERARY: "trip/:id/itinerary",
  ATTENDANCE: "trip/:id/attendance",
  HOTEL: "trip/:id/hotel",
  NOTIFICATIONS: "trip/:id/notifications",
  PROFILE: "profile",
  EMERGENCY: "emergency",
} as const;
