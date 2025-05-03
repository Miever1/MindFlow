import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left side */}
        {showBack ? (
            <Pressable onPress={onBack ?? (() => router.back())} style={styles.iconButton}>
            <FontAwesome name="chevron-left" size={20} color="#1e293b" />
            </Pressable>
        ) : (
            <View style={styles.placeholder} />
        )}

        {/* Center title */}
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right side */}
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
      <Divider />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
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