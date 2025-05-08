import { Button, ButtonText } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const proposals = [
  {
    id: 1,
    title: "Proposal 1",
    description: "Study for the exam tomorrow in a block of 4h, and go out with friends to cheer up today.",
  },
  {
    id: 2,
    title: "Proposal 2",
    description: "Study for the exam tomorrow and on Saturday 2h each day, and take some time to rest or to do another activity today.",
  }
];

export default function RescheduleScreen() {
  const router = useRouter();

  const handlePreview = (id: number) => {
    console.log(`Previewing proposal ${id}`);
  };

  const handleApply = (id: number) => {
    console.log(`Applying proposal ${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Reschedule" onBack={() => router.push("/tabs")} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <VStack space="md">
          <View style={styles.introBox}>
            <Text style={styles.introText}>
              To study for an exam when you're not feeling well could be more difficult than usual, 
              then I recommend you the following proposals to reschedule your tasks:
            </Text>
          </View>

          {proposals.map((proposal) => (
            <View key={proposal.id} style={styles.proposalBox}>
              <Text style={styles.proposalTitle}>{proposal.title}</Text>
              <Text style={styles.proposalDescription}>{proposal.description}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handlePreview(proposal.id)}>
                  <Button variant="outline">
                    <ButtonText>Preview</ButtonText>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleApply(proposal.id)}>
                  <Button>
                    <ButtonText>Apply</ButtonText>
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </VStack>
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
    padding: 20,
  },
  introBox: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
  },
  proposalBox: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  proposalDescription: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 12,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});