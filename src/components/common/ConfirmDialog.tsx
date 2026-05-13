import { Modal, View, Text, TouchableOpacity } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  confirmDanger,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full gap-4">
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
          <Text className="text-gray-500 text-sm leading-5">{message}</Text>
          <View className="flex-row gap-3 pt-2">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 h-12 border border-gray-200 rounded-xl items-center justify-center"
            >
              <Text className="text-gray-600 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 h-12 rounded-xl items-center justify-center ${
                confirmDanger ? "bg-red-600" : "bg-teal-600"
              }`}
            >
              <Text className="text-white font-semibold">{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
