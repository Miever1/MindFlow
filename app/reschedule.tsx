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
  const { addSchedule } = useSchedule();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalTask, setModalTask] = useState<ScheduleItem | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  const handlePreview = (id: number) => {
    const proposal = proposals.find((p) => p.id === id);
    if (proposal) {
      setModalTitle("Preview Task");
      setModalMessage("");
      setModalTask(proposal.task);
      setShowModal(true);
    }
  };

  const generateTaskId = () => {
    return `id-${dayjs().format("YYYYMMDDHHmmssSSS")}`;
  };

  const handleApply = async (id: number) => {
    const proposal = proposals.find((p) => p.id === id);
    if (proposal) {
        const today = dayjs().format("YYYY-MM-DD");
        const task: ScheduleItem = {
            ...proposal.task,
            id: generateTaskId(),
            time: proposal.task.time,
            duration: proposal.task.duration,
        };

        try {
            const conflict = await addSchedule(today, task, true);

            if (!conflict) {
                setModalTitle("Task Added Successfully");
                setModalMessage(`Task "${task.title}" was added to your schedule.`);
                setModalTask(task);
                setIsSuccess(true);
            } else {
                setModalTitle("Task Conflict Detected");
                setModalMessage(`Conflict detected with task: "${conflict.title}"`);
                setModalTask(task);
                setIsSuccess(false);
            }

            setShowModal(true);
        } catch (error) {
            console.error("Failed to add task:", error);
            setModalTitle("Error");
            setModalMessage("Failed to add task. Please try again.");
            setModalTask(task);
            setIsSuccess(false);
            setShowModal(true);
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>{modalTitle}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {modalTask && (
              <>
                <Text style={styles.modalSubTitle}>📅 Task Details:</Text>
                <Text style={styles.modalText}>Title: {modalTask.title}</Text>
                <Text style={styles.modalText}>Location: {modalTask.location}</Text>
                <Text style={styles.modalText}>Time: {modalTask.time}</Text>
                <Text style={styles.modalText}>Duration: {modalTask.duration}</Text>
              </>
            )}
            {modalMessage && (
              <Text style={[styles.modalText, isSuccess ? styles.successText : styles.errorText]}>
                {modalMessage}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            {modalTitle === "Preview Task" ? (
              <Button
                onPress={() => {
                  setShowModal(false);
                  handleApply(proposals.find((p) => p.task === modalTask)?.id || 0);
                }}
              >
                <ButtonText>Apply</ButtonText>
              </Button>
            ) : (
              <Button onPress={() => {
                setShowModal(false);
                router.push("/tabs/schedule-list");
              }}>
                <ButtonText>OK</ButtonText>
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  successText: {
    color: "#10b981",
  },
  errorText: {
    color: "#ef4444",
  },
});