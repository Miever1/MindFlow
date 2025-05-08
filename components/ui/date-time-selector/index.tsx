import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  label: string;
  time: Date | null;
  date: Date | null;
  onTimeChange: (val: Date) => void;
  onDateChange: (val: Date) => void;
};

export default function DateTimeField({
  label,
  time,
  date,
  onTimeChange,
  onDateChange,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleOpen = (targetMode: "date" | "time") => {
    setMode(targetMode);
    setShowPicker(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const isConfirmed = event.type === "set";
    if (isConfirmed && selectedDate) {
      mode === "time" ? onTimeChange(selectedDate) : onDateChange(selectedDate);
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable style={styles.inputBox} onPress={() => handleOpen("time")}>
          <Text style={styles.text}>
            {time ? dayjs(time).format("HH:mm") : "Select Time"}
          </Text>
        </Pressable>

        <Pressable style={styles.inputBox} onPress={() => handleOpen("date")}>
          <Text style={styles.text}>
            {date ? dayjs(date).format("MM/DD/YYYY") : "Select Date"}
          </Text>
        </Pressable>
      </View>

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={mode === "time" ? (time || new Date()) : (date || new Date())}
                  mode={mode}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    handleChange(event, selectedDate);
                    setShowPicker(false);
                  }}
                  style={{ backgroundColor: "#fff" }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {showPicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={mode === "time" ? (time || new Date()) : (date || new Date())}
          mode={mode}
          display="default"
          onChange={handleChange}
          is24Hour={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#0f172a",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 12,
  },
});