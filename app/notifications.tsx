import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import Header from "@/components/ui/header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import dayjs from "dayjs";

const mockNotifications = [
    {
      id: "1",
      title: "New tip for today in your home!",
      icon: "heart",
      date: "2025-04-03",
      read: false,
    },
    {
      id: "2",
      title: "Remember to share how you are feeling today",
      icon: "smile-o",
      date: "2025-04-03",
      read: false,
    },
    {
      id: "3",
      title: "You have a meeting at 3:00 PM",
      icon: "calendar",
      date: "2025-04-02",
      read: true,
    },
    {
      id: "4",
      title: "Weekly goal completed, great job!",
      icon: "trophy",
      date: "2025-04-01",
      read: true,
    },
    {
      id: "5",
      title: "Try the breathing exercise now",
      icon: "medkit",
      date: "2025-03-31",
      read: false,
    },
    {
      id: "6",
      title: "Mood trend summary is ready",
      icon: "line-chart",
      date: "2025-03-30",
      read: true,
    },
    {
      id: "7",
      title: "Don’t forget to log your water intake",
      icon: "tint",
      date: "2025-03-30",
      read: false,
    },
    {
      id: "8",
      title: "You’ve unlocked a new badge!",
      icon: "star",
      date: "2025-03-29",
      read: true,
    },
];

export default function NotificationScreen() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notifications"
        onBack={() => router.replace("/tabs/schedule-list")}
        rightAction={
            showButton &&
            (
            <TouchableOpacity>
                <Text
                    onPress={() =>{
                        setShowButton(false);
                        markAllAsRead();
                    }}
                    style={{ fontSize: 15, color: "#3b82f6", fontWeight: "500" }}
                >
                    Mark All
                </Text>
            </TouchableOpacity>)
        }
        />
      <ScrollView contentContainerStyle={styles.scroll}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.item}>
            <FontAwesome
              name={item.icon as any}
              size={20}
              color={item.read ? "#94a3b8" : "#3b82f6"}
              style={styles.icon}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={
                    item.read
                      ? { ...styles.title, color: "#64748b" }
                      : styles.title
                  }
              >
                {item.title}
              </Text>
              <Text style={styles.date}>
                {dayjs(item.date).format("MMM D")}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#334155",
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  icon: {
    marginTop: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0f172a",
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: "#94a3b8",
  },
});