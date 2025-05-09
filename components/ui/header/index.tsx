// Header.tsx
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  title: string;
  onAdd?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export default function Header({ title, onAdd, onBack, showBack = true, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={Platform.OS === "ios" ? [] : ["top", "left", "right"] } style={styles.safeArea}>
      <View style={styles.container}>
        {showBack ? (
          <Pressable onPress={onBack ?? (() => router.back())} style={styles.iconButton}>
            <FontAwesome name="chevron-left" size={20} color="#1e293b" />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightAction ? (
          <View style={styles.rightWrapper}>{rightAction}</View>
        ) : onAdd ? (
          <Pressable onPress={onAdd} style={styles.addButton}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  titleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
  rightWrapper: {
    minWidth: 40,
    alignItems: "flex-end",
  },
});