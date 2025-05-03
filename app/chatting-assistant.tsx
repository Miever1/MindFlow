import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import Header from "@/components/ui/header";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";

export const fullConversation: Message[] = [
    { id: "1", type: "bot", text: "What task would you like to add?" },
    { id: "2", type: "user", text: "A Webinar" },
  
    { id: "3", type: "bot", text: "Where is it going to be located?" },
    { id: "4", type: "user", text: "It's remote by Zoom" },
  
    { id: "5", type: "bot", text: "What's the priority of this task?" },
    { id: "6", type: "user", text: "It's high priority" },
  
    { id: "7", type: "bot", text: "When and what time is it going to start and end?" },
    { id: "8", type: "user", text: "Today, at 5:30 PM and ends at 6:30 PM" },
  
    { id: "9", type: "bot", text: "Is this a recurrent task? If yes, how often?" },
    { id: "10", type: "user", text: "No, it isn't" },
  
    { id: "11", type: "bot", text: "Would you like to add a reminder for this? If yes, what time?" },
    { id: "12", type: "user", text: "Yes, at the time of the event, please" },
  
    { id: "13", type: "bot", text: "Any other info that you would like to add to this task?" },
    { id: "14", type: "user", text: "Add that this is mandatory for the university" },
  
    { id: "15", type: "bot", text: "OK, let me process it, and add to your calendar!" },
    { 
      id: "16", 
      type: "bot", 
      text: "It seems this new high priority task is in conflict with another at 6 PM. Do you want I help you to reschedule the previous one?" 
    },
    { id: "17", type: "user", text: "Yes" },
  
    { id: "18", type: "bot", text: "OK, click here to view your tasks adjusted in the calendar", isLink: true }
];

type Message = {
    id: string;
    type: "bot" | "user";
    text: string;
    isLink?: boolean;
    duration?: string;
    isVoice?: boolean;
};

export default function VoiceAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([fullConversation[0]]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [isListening, setIsListening] = useState(false);
  const listenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getNextBotMessages = (startIndex: number): Message[] => {
    const result: Message[] = [];
    for (let i = startIndex; i < fullConversation.length; i++) {
      const msg = fullConversation[i];
      if (msg.type === "bot") {
        result.push({ ...msg, id: Date.now().toString() + "-" + i });
      } else {
        break;
      }
    }
    return result;
  };

  const handleUserSend = (text: string) => {
    if (!text.trim()) return;
  
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text,
    };
  
    const botMessages = getNextBotMessages(step + 1);
    setMessages((prev) => [...prev, userMsg]);
    setStep((prev) => prev + 1 + botMessages.length);
    setInput("");
  
    setTimeout(() => {
      setMessages((prev) => [...prev, ...botMessages]);
    }, 500);
  };

  const cancelVoiceInput = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    setIsListening(false);
    setInputMode("text");
  };

  const handleMicPress = () => {
    setIsListening(true);
    setInputMode("voice");
  
    listenTimeoutRef.current = setTimeout(() => {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        text: "",
        isVoice: true,
        duration: "00:05",
      };
  
      const botMessages = getNextBotMessages(step + 1);
      setStep((prev) => prev + 1 + botMessages.length);
      setMessages((prev) => [...prev, voiceMessage]);
  
      setInputMode("text");
      setIsListening(false);
  
      setTimeout(() => {
        setMessages((prev) => [...prev, ...botMessages]);
      }, 500);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="AI Assistant" />

      <FlatList
        style={styles.chat}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.type === "user" ? styles.userRow : styles.botRow,
              ]}
            >
              {item.type === "bot" && (
                <Avatar style={styles.avatar}>
                  <AvatarFallbackText>Bot</AvatarFallbackText>
                  <AvatarImage source={{ uri: "https://i.pravatar.cc/100?u=bot" }} />
                </Avatar>
              )}
          
              <View
                style={[
                  styles.bubble,
                  item.type === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                {item.isVoice ? (
                  <View style={styles.voiceBubble}>
                    <FontAwesome6
                      name="microphone"
                      size={14}
                      color={item.type === "user" ? "#fff" : "#0f172a"}
                    />
                    <Text
                      style={[
                        styles.voiceDuration,
                        item.type === "user" && { color: "#fff" },
                      ]}
                    >
                      {item.duration || "00:05"}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.messageText,
                      item.type === "user" && { color: "#fff" },
                      item.isLink && {
                        color: "#3b82f6",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    {item.text}
                  </Text>
                )}
              </View>
          
              {item.type === "user" && (
                <Avatar style={styles.avatar}>
                  <AvatarFallbackText>U</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: "https://gluestack.github.io/public-blog-video-assets/camera.png",
                    }}
                  />
                </Avatar>
              )}
            </View>
          )}
      />

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.inputArea}
        >
        {inputMode === "voice" && isListening ? (
            <View style={styles.voiceBox}>
            <FontAwesome6 name="microphone" size={20} color="#334155" />
            <Text style={styles.voiceText}>Listening...</Text>
            <TouchableOpacity onPress={cancelVoiceInput}>
                <FontAwesome6 name="times-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.inputBox}>
            <TextInput
                style={styles.input}
                placeholder="Type to add a task..."
                value={input}
                onChangeText={setInput}
                placeholderTextColor="#94a3b8"
                onSubmitEditing={() => handleUserSend(input)}
            />
            <TouchableOpacity onPress={handleMicPress} style={styles.micButton}>
                <FontAwesome6 name="microphone" size={20} color="#334155" />
            </TouchableOpacity>
            </View>
        )}
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chat: { flex: 1, padding: 16 },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  botRow: { justifyContent: "flex-start" },
  userRow: { justifyContent: "flex-end" },
  avatar: {
    marginHorizontal: 8,
    width: 32,
    height: 32,
  },
  bubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 12,
  },
  botBubble: {
    backgroundColor: "#f1f5f9",
  },
  userBubble: {
    backgroundColor: "#3b82f6",
  },
  messageText: {
    fontSize: 15,
    color: "#0f172a",
  },
  inputArea: {
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
  },
  micButton: {
    marginLeft: 12,
    padding: 8,
  },
  voiceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  voiceText: {
    flex: 1,
    textAlign: "center",
    color: "#92400e",
    fontWeight: "500",
    marginHorizontal: 8,
  },
  voiceBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  voiceDuration: {
    fontSize: 15,
    color: "#0f172a",
  }
});