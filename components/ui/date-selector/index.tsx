import React, { useRef, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

interface DateSelectorProps {
    selectedDate: string;
    onSelect: (date: string) => void;
    minDate: string;
    maxDate: string;
}

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DateSelector({
    selectedDate,
    onSelect,
    minDate,
    maxDate
  }: DateSelectorProps) {
  const generateDatesInRange = () => {
    const start = dayjs(minDate);
    const end = dayjs(maxDate);
    const dates = [];
    for (let d = start; d.isSameOrBefore(end, 'day'); d = d.add(1, 'day')) {
      dates.push({
        key: d.format('YYYY-MM-DD'),
        day: d.date(),
        dayOfWeek: daysOfWeek[d.day()],
      });
    }
    return dates;
  };

  const dates = generateDatesInRange();
  const selectedIndex = dates.findIndex(d => d.key === selectedDate);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (flatListRef.current && selectedIndex >= 0) {
      flatListRef.current.scrollToIndex({ index: selectedIndex, animated: true });
    }
  }, [selectedIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.monthText}>{dayjs(selectedDate).format('MMMM')}</Text>
      <FlatList
        ref={flatListRef}
        horizontal
        data={dates}
        initialScrollIndex={selectedIndex > 0 ? selectedIndex : 0}
        getItemLayout={(data, index) => ({
          length: 66,
          offset: 66 * index,
          index,
        })}
        renderItem={({ item }) => {
          const isSelected = item.key === selectedDate;
          return (
            <TouchableOpacity onPress={() => onSelect(item.key)} style={styles.dateItem}>
              <View style={[styles.circle, isSelected && styles.selectedCircle]}>
                <Text style={isSelected ? styles.selectedText : styles.dateText}>{item.dayOfWeek}</Text>
                <Text style={isSelected ? styles.selectedText : styles.dateText}>{item.day}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 16,
    marginBottom: 8,
  },
  dateItem: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: '#e0f2fe',
  },
  dateText: {
    color: '#333',
    fontSize: 14,
  },
  selectedText: {
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
});