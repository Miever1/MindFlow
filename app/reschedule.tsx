import { Button, ButtonText } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScheduleItem, useSchedule } from "./context/schedule-context";

const proposals = [
  {
    id: 1,
    title: "Proposal 1",
    description: "Study for the exam tomorrow in a block of 2h, and go out with friends to cheer up today.",
    task: {
      title: "Study for exam",
      location: "Home",
      time: "10:00",
      duration: "2h",
    },
  },
  {
    id: 2,
    title: "Proposal 2",
    description: "Study for the exam tomorrow and on Saturday 2h each day, and take some time to rest or to do another activity today.",
    task: {
      title: "Study for exam",
      location: "Home",
      time: "20:00",
      duration: "2h",
    },
  },
];

export default function RescheduleScreen() {
  const router = useRouter();
  const { addSchedule, schedules } = useSchedule();
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ScheduleItem | null>(null);

  const handlePreview = (id: number) => {
    const proposal = proposals.find((p) => p.id === id);
    if (proposal) {
      setSelectedProposal(proposal.task);
      setShowModal(true);
    }
  };

  const handleApply = (id: number) => {
    const proposal = proposals.find((p) => p.id === id);
    
    if (proposal) {
      const today = dayjs().format("YYYY-MM-DD");
      const task: ScheduleItem = {
        ...proposal.task,
        time: proposal.task.time,
        duration: proposal.task.duration,
      };

      const conflict = addSchedule(today, task, true);
      if (!conflict) {
        console.log(`Task "${task.title}" added successfully.`);
        alert(`Task "${task.title}" added successfully.`);
        router.push("/tabs/schedule-list");
      } else {
        console.log(`Conflict detected with task: ${conflict.title}`);
        alert(`Conflict detected with task: ${conflict.title}`);
      }
    }
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
                <Button variant="outline" onPress={() => handlePreview(proposal.id)}>
                  <ButtonText>Preview</ButtonText>
                </Button>
                <Button onPress={() => handleApply(proposal.id)}>
                  <ButtonText>Apply</ButtonText>
                </Button>
              </View>
            </View>
          ))}
        </VStack>
      </ScrollView>

      {selectedProposal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading>
                Preview Task
              </Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} size="md" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text style={styles.modalSubTitle}>📅 Task:</Text>
              <Text style={styles.modalText}>Title: {selectedProposal.title}</Text>
              <Text style={styles.modalText}>Location: {selectedProposal.location}</Text>
              <Text style={styles.modalText}>Time: {selectedProposal.time}</Text>
              <Text style={styles.modalText}>Duration: {selectedProposal.duration}</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={() => {
                  setShowModal(false);
                  handleApply(proposals.find((p) => p.task === selectedProposal)?.id || 0);
                }}
              >
                <ButtonText>Apply</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
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
  modalSubTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  modalText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#64748b",
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
});