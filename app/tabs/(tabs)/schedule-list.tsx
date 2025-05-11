import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import DateSelector from '@/components/ui/date-selector';
import { Heading } from '@/components/ui/heading';
import { AddIcon, CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { useFocusEffect } from "@react-navigation/native";
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  SectionList as RNSectionList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSchedule } from '../../context/schedule-context';

interface ScheduleItem {
  time?: string;
  duration?: string;
  title?: string;
  location?: string;
  __empty?: boolean;
}

interface ScheduleSection {
  title: string;
  date: string;
  data: ScheduleItem[];
}

const ITEM_HEIGHT = 42;

export default function ScheduleList() {
  const router = useRouter();
  // @ts-ignore
  const { schedules, removeSchedule } = useSchedule();
  const [sections, setSections] = useState<ScheduleSection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const sectionListRef = useRef<RNSectionList<ScheduleItem>>(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 });
  const isAutoScrollingRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
        const startDate = dayjs().subtract(14, 'day');
        const endDate = dayjs("2025-05-16");
        const allDates: ScheduleSection[] = [];

        for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate, 'day'); d = d.add(1, 'day')) {
            const dateStr = d.format("YYYY-MM-DD");
            const isToday = dateStr === dayjs().format("YYYY-MM-DD");

            allDates.push({
                title: isToday ? `Today - ${dateStr}` : dateStr,
                date: dateStr,
                data: schedules[dateStr] && schedules[dateStr].length > 0 ? schedules[dateStr] : [{ __empty: true }],
            });
        }

        setSections(allDates);

        const todayIndex = allDates.findIndex(section => section.date === dayjs().format("YYYY-MM-DD"));
        if (todayIndex !== -1 && sectionListRef.current) {
            setTimeout(() => {
                sectionListRef.current?.scrollToLocation({
                    sectionIndex: todayIndex,
                    itemIndex: 0,
                    viewPosition: 0.3,
                    animated: true,
                });
            }, 300);
        }

    }, [schedules])
);

const handleDateSelect = (date: string) => {
  setSelectedDate(date);
  const index = sections.findIndex(section =>
    section.date === date
  );

  if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          viewPosition: 0,
          animated: true,
      });
  }
};

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (isAutoScrollingRef.current) return;

    const firstVisible = viewableItems.find(v => v.section?.date);
    if (firstVisible?.section?.date) {
      setSelectedDate(firstVisible.section.date);
    }
  });

  const allDates = sections.map((section) => section.date);
  const minDate = allDates[0] || "2025-04-20";
  const maxDate = allDates[allDates.length - 1] || "2025-05-16";

  return (
    <Box style={{ flex: 1, position: 'relative' }}>
      <DateSelector
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
        minDate={dayjs().subtract(14, 'day').format("YYYY-MM-DD")}
        maxDate={maxDate}
      />

      <SectionList<ScheduleItem, ScheduleSection>
        // @ts-ignore
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        renderItem={({ section, item, index }) =>
          "__empty" in item && item.__empty ? (
            <View style={styles.emptyItemContainer}>
              <Text style={styles.emptyText}>No schedule</Text>
            </View>
          ) : (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      "Delete Task",
                      `Are you sure you want to delete "${item.title}"?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            removeSchedule(section.date, index);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <View style={styles.itemContainer}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.locationRow}>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          )
        }
        renderSectionFooter={() => null}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: index * ITEM_HEIGHT,
          index,
        })}
      />

      <TouchableOpacity 
        style={styles.fabContainer}
      >
          <Button
            size="lg"
            className="rounded-full p-0 w-16 h-16"
            onPress={() => setShowModal(true)}
          >
            <ButtonIcon as={AddIcon} size="lg" />
          </Button>
      </TouchableOpacity>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">Add a New Task</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              How would you like to add your task?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
                router.push('/chatting-assistant');
              }}
            >
              <ButtonText>AI Assistant</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
                router.push('/create-event');
              }}
            >
              <ButtonText>Manually</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#f87171',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#f8fafc',
    padding: 14,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  durationText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  line: {
    width: 2,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
    marginTop: 2,
    borderRadius: 1,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    color: '#64748b',
    fontSize: 14,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  emptyItemContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});