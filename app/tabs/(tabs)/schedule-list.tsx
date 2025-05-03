import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import {
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  SectionList as RNSectionList,
  ViewToken,
  InteractionManager,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateSelector from '@/components/ui/date-selector';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

// ✅ 类型定义
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


// ✅ 生成日程数据
function generateScheduleWithFixedTasks(): ScheduleSection[] {
  const startDate = dayjs('2025-04-20');
  const endDate = dayjs('2025-05-16');
  const result: ScheduleSection[] = [];

  for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate, 'day'); d = d.add(1, 'day')) {
    const dateStr = d.format('YYYY-MM-DD');
    const isToday = dateStr === '2025-05-02';
    const isTomorrow = dateStr === '2025-05-03';

    const data: ScheduleItem[] = isToday
      ? [
          { time: '9:00 AM', duration: '2h', title: 'Gym', location: 'Gym' },
          { time: '12:00', duration: '2h', title: 'Class 2', location: 'Room 5005' },
          { time: '2:00 PM', duration: '1h', title: 'Lunch', location: 'Cafeteria' },
          { time: '3:00 PM', duration: '2h', title: 'Class 3', location: 'Room 6201' },
          { time: '6:00 PM', duration: '2h', title: 'Do groceries', location: 'Supermarket' },
        ]
      : isTomorrow
      ? [
          { time: '10:00 AM', duration: '2h', title: 'Class 1', location: 'Room 5001' },
          { time: '1:00 PM', duration: '1h', title: 'Project Meeting', location: 'Zoom' },
          { time: '2:30 PM', duration: '1.5h', title: 'Library Study', location: 'Library - 2F' },
          { time: '4:30 PM', duration: '1h', title: 'Coffee Break', location: 'Cafe Bliss' },
          { time: '6:00 PM', duration: '2h', title: 'Dinner with Team', location: 'Sushi House' },
        ]
      : [];

    result.push({
      title: `${isToday ? 'Today - ' : ''}${d.format('ddd MMM D')}`,
      date: dateStr,
      data: data.length ? data : [{ __empty: true }],
    });
  }

  return result;
}

const rawScheduleData: ScheduleSection[] = generateScheduleWithFixedTasks();

export default function ScheduleList() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const sectionListRef = useRef<RNSectionList<ScheduleItem>>(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 });
  const isAutoScrollingRef = useRef(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const index = rawScheduleData.findIndex(section =>
      dayjs(section.date).isSame(date, 'day')
    );
    console.log('index', index, 'date', date);

    if (index !== -1 && sectionListRef.current) {
      isAutoScrollingRef.current = true;

      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          sectionListRef.current?.scrollToLocation({
            sectionIndex: index,
            itemIndex: 0,
            viewPosition: 0,
            animated: true,
          });

          setTimeout(() => {
            isAutoScrollingRef.current = false;
          }, 500);
        });
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

  const allDates = rawScheduleData.map(s => s.date);
  const minDate = allDates[0];
  const maxDate = allDates[allDates.length - 1];

  return (
    <Box style={{ flex: 1, position: 'relative' }}>
      <DateSelector
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
        minDate={minDate}
        maxDate={maxDate}
      />

      <SectionList<ScheduleItem, ScheduleSection>
        // @ts-ignore
        ref={sectionListRef}
        sections={rawScheduleData}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        renderItem={({ item }) =>
          item?.__empty ? (
            <View style={styles.emptyItemContainer}>
              <Text style={styles.emptyText}>No schedule</Text>
            </View>
          ) : (
            <View style={styles.itemContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
              <View style={styles.line} />
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.locationRow}>
                  <FontAwesome name="map-marker" size={14} color="#aaa" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>
            </View>
          )
        }
        renderSectionFooter={() => null}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: index * ITEM_HEIGHT,
          index,
        })}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <FontAwesome name="plus" size={24} color="#fff" />
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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