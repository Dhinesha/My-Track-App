import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing, Radius } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { Button } from "./Button";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  style?: ViewStyle;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.dialog, style]}>
          <Text style={[Typography.screenTitle, styles.title]}>{title}</Text>

          <Text style={[Typography.body, styles.message]}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onCancel && (
              <Button
                label={cancelText}
                onPress={onCancel}
                variant="secondary"
                size="md"
                style={styles.button}
              />
            )}

            <Button
              label={confirmText}
              onPress={onConfirm}
              variant={isDangerous ? "danger" : "primary"}
              size="md"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: "80%",
    maxWidth: 320,
  },
  title: {
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  message: {
    marginBottom: Spacing.xl,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
