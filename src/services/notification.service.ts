import { Alert, ToastAndroid, Platform } from "react-native";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
}

/**
 * Cross-platform notification service
 * Uses Toast on Android, Alert on iOS
 */
export const NotificationService = {
  /**
   * Show a toast/snackbar notification
   */
  showToast(
    message: string,
    type: NotificationType = "info",
    duration: number = 2000,
  ) {
    if (Platform.OS === "android") {
      ToastAndroid.show(
        message,
        duration > 2500 ? ToastAndroid.LONG : ToastAndroid.SHORT,
      );
    } else {
      Alert.alert(type.toUpperCase(), message);
    }
  },

  /**
   * Show success notification
   */
  success(message: string) {
    this.showToast(message, "success", 2000);
  },

  /**
   * Show error notification
   */
  error(message: string) {
    this.showToast(message, "error", 3000);
  },

  /**
   * Show info notification
   */
  info(message: string) {
    this.showToast(message, "info", 2000);
  },

  /**
   * Show warning notification
   */
  warning(message: string) {
    this.showToast(message, "warning", 2500);
  },

  /**
   * Show confirmation dialog
   */
  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) {
    Alert.alert(title, message, [
      {
        text: "Cancel",
        onPress: onCancel || (() => {}),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: onConfirm,
        style: "default",
      },
    ]);
  },

  /**
   * Show alert
   */
  alert(title: string, message: string, onPress?: () => void) {
    Alert.alert(title, message, [
      {
        text: "OK",
        onPress: onPress || (() => {}),
      },
    ]);
  },
};
