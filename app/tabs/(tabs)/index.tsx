import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useRef, useState } from 'react';
import { Dimensions, SectionList as RNSectionList, ScrollView, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get('window').width;
const moodEmojis = ["😁", "😊", "🙂", "😐", "😞"];
const moodIcons = [
  { name: 'face-sad-cry', bg: '#fee2e2', color: '#b91c1c' },
  { name: 'face-frown', bg: '#fef9c3', color: '#92400e' },
  { name: 'face-smile', bg: '#d1fae5', color: '#065f46' },
  { name: 'face-grin-beam', bg: '#cffafe', color: '#155e75' },
  { name: 'face-laugh-squint', bg: '#dbeafe', color: '#1e40af' },
];

export default function Home() {
  const router = useRouter();
  const sectionListRef = useRef<RNSectionList>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    setShowModal(true);
    console.log(`Selected Mood Index: ${index}`);
  };


  const handleTodayPress = () => {
    const today = dayjs().format("YYYY-MM-DD");
    router.push({
      pathname: "/tabs/schedule-list",
      params: { targetDate: today },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}>
      <Box>
        <Card className="p-6 rounded-2xl mb-6 shadow-md bg-blue-50">
          <Text className="text-lg text-blue-900 mb-4 font-semibold">
            Welcome Back! 👋
          </Text>
          <Text className="text-base text-gray-700 mb-4">
            Today, you have a long day with multiple tasks. Remember to take breaks and breathe.
          </Text>
          <Button
            className="rounded-lg"
            onPress={handleTodayPress}
          >
            <ButtonText className="text-white text-base font-semibold">See your tasks for today</ButtonText>
          </Button>
        </Card>

        <Card className="p-5 rounded-2xl mb-6 shadow-sm bg-white">
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            How are you feeling today?
          </Text>
          <Box className="flex-row justify-between mt-2">
            {moodIcons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMoodSelect(index)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    backgroundColor: selectedMood === index ? icon.bg : "#f9fafb",
                    borderRadius: 16,
                    padding: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                    borderWidth: selectedMood === index ? 2 : 0,
                    borderColor: selectedMood === index ? icon.color : "transparent",
                  }}
                >
                  <FontAwesome6 name={icon.name} size={26} color={icon.color} />
                </View>
              </TouchableOpacity>
            ))}
          </Box>
        </Card>

        <Card className="p-5 rounded-2xl shadow-sm bg-white">
          <Text className="text-center text-lg font-bold mb-4 text-gray-900">Mood Trend</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                position: 'absolute',
                left: 16,
                top: 0,
                bottom: 0,
                zIndex: 1,
                justifyContent: 'space-between',
                paddingTop: 12,
                paddingBottom: 36,
              }}
            >
              {moodEmojis.map((mood, index) => (
                <Text key={index} style={{ fontSize: 18 }}>{mood}</Text>
              ))}
            </View>

            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: [1, 4, 2, 5, 4, 3, 4] }],
              }}
              width={screenWidth - 80}
              height={240}
              fromZero
              withVerticalLabels={false}
              withHorizontalLabels={false}
              withInnerLines
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#f0f9ff',
                backgroundGradientTo: '#dbeafe',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3b82f6',
                },
              }}
              bezier
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        </Card>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="md" className="text-typography-950">Today’s Vibes</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} size="md" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text size="sm" className="text-typography-500">
                Would you like me to help you reschedule your tasks today based on your current mood?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setShowModal(false);
                  setSelectedMood(null);
                }}
              >
                <ButtonText>No</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                  router.push('/reschedule');
                  setSelectedMood(null);
                }}
              >
                <ButtonText>Yes</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ScrollView>
  );
}