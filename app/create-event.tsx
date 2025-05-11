import { Button, ButtonText } from '@/components/ui/button';
import DateTimePickerField from "@/components/ui/date-time-selector";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import Header from "@/components/ui/header";
import { Heading } from '@/components/ui/heading';
import { ChevronDownIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { ScheduleItem, useSchedule } from "./context/schedule-context";

export default function CreateEventScreen() {
  const router = useRouter();
  const [taskDuration, setTaskDuration] = useState("");
  const { schedules, addSchedule } = useSchedule();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("none");
  const [note, setNote] = useState("");
  const [repeat, setRepeat] = useState("never");
  const [alert, setAlert] = useState("none");
  const [startTime, setStartTime] = useState<Date | null>(dayjs().toDate());
  const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
  const [endTime, setEndTime] = useState<Date | null>(dayjs().add(1, 'hour').toDate());
  const [endDate, setEndDate] = useState<Date | null>(dayjs().toDate());
  const [conflictTask, setConflictTask] = useState<ScheduleItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<string | null>(null);
  
  const handleAdd = async () => {
    if (!title) {
        return;
    }

    const startDateTime = dayjs(startDate).format("YYYY-MM-DD");
    const startTimeFormatted = dayjs(startTime).format("HH:mm");

    const durationMinutes = dayjs(endTime).diff(dayjs(startTime), "minute");
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const durationFormatted = 
        hours > 0 && minutes > 0 ? `${hours}h ${minutes}m` :
        hours > 0 ? `${hours}h` :
        `${minutes}m`;

    setTaskDuration(durationFormatted);

    const newTask = {
        time: startTimeFormatted,
        duration: durationFormatted,
        title,
        location,
        priority,
    };

    try {
        const conflict = await addSchedule(startDateTime, newTask);

        if (conflict) {
            setConflictTask(conflict);
            setTimeout(() => findNextAvailableSlot(durationFormatted), 100);
            setShowModal(true);
            return;
        }

        setTimeout(() => findNextAvailableSlot(durationFormatted), 100);
        setTitle("");
        setLocation("");
        setTaskDuration("");
        setPriority("none");
        setNote("");
        router.push("/tabs/schedule-list");
    } catch (error) {
        console.error("Failed to add schedule:", error);
    }
};

const handleIgnoreConflict = async () => {
  const startDateTime = dayjs(startDate).format("YYYY-MM-DD");
  
  const newTask: ScheduleItem = {
    time: dayjs(startTime).format("HH:mm"),
    duration: taskDuration,
    title,
    location,
    priority,
  };

  await addSchedule(startDateTime, newTask, true);
  
  setShowModal(false);
  router.push("/tabs/schedule-list");
};

const parseDuration = (duration: string) => {
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  return hours * 60 + minutes;
};

const findNextAvailableSlot = (duration = "1h") => {
  const durationMinutes = parseDuration(duration);
  let currentDateTime = dayjs();

  while (true) {
      const currentDate = currentDateTime.format("YYYY-MM-DD");
      const tasks = schedules[currentDate] || [];

      if (tasks.length === 0) {
          const suggestedTime = currentDateTime.set("hour", 8).set("minute", 0);
          setNextAvailableTime(suggestedTime.format("YYYY-MM-DD HH:mm"));
          return suggestedTime;
      }

      for (let i = 0; i < tasks.length; i++) {
          const currentTask = tasks[i];
          const nextTask = tasks[i + 1];

          const currentEndTime = dayjs(`${currentDate} ${currentTask.time}`, "YYYY-MM-DD HH:mm")
              .add(parseDuration(currentTask.duration), "minute");

          const endOfDay = dayjs(`${currentDate} 23:59`, "YYYY-MM-DD HH:mm");
          if (!nextTask && currentEndTime.add(durationMinutes, "minute").isBefore(endOfDay)) {
              setNextAvailableTime(currentEndTime.format("YYYY-MM-DD HH:mm"));
              return currentEndTime;
          }

          if (nextTask) {
              const nextStartTime = dayjs(`${currentDate} ${nextTask.time}`, "YYYY-MM-DD HH:mm");
              if (nextStartTime.diff(currentEndTime, "minute") >= durationMinutes) {
                  setNextAvailableTime(currentEndTime.format("YYYY-MM-DD HH:mm"));
                  return currentEndTime;
              }
          }
      }

      currentDateTime = currentDateTime.add(1, "day").set("hour", 8).set("minute", 0);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Create Event"
        onAdd={title ? handleAdd : undefined}
        onBack={() => router.push("/tabs/schedule-list")}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <VStack space="md">
          <FormControl
            isRequired
            isInvalid={!title}
          >
            <FormControlLabel>
              <FormControlLabelText>Title</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Location</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Priority</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={priority}
              onValueChange={(val) => setPriority(val)}
            >
              <SelectTrigger className="flex-row items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
                <SelectInput className="flex-1 text-base text-gray-900" placeholder="Select priority" />
                <SelectIcon className="ml-2" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="None" value="none" />
                  <SelectItem label="High" value="high" />
                  <SelectItem label="Medium" value="medium" />
                  <SelectItem label="Low" value="low" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Repeat</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={repeat}
              onValueChange={(val) => setRepeat(val)}
            >
              <SelectTrigger className="flex-row items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
                <SelectInput className="flex-1 text-base text-gray-900" placeholder="Select priority" />
                <SelectIcon className="ml-2" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Never" value="never" />
                  <SelectItem label="Daily" value="daily" />
                  <SelectItem label="Weekly" value="weekly" />
                  <SelectItem label="Monthly" value="monthly" />
                  <SelectItem label="Yearly" value="yearly" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Alert</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={alert}
              onValueChange={(val) => setAlert(val)}
            >
              <SelectTrigger className="flex-row items-center px-3 py-2 border border-gray-300 rounded-md bg-white">
                <SelectInput className="flex-1 text-base text-gray-900" placeholder="Select alert time" />
                <SelectIcon className="ml-2" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="None" value="none" />
                  <SelectItem label="At time of event" value="at_event" />
                  <SelectItem label="5 minutes before" value="5_min" />
                  <SelectItem label="10 minutes before" value="10_min" />
                  <SelectItem label="30 minutes before" value="30_min" />
                  <SelectItem label="1 hour before" value="1_hr" />
                  <SelectItem label="1 day before" value="1_day" />
                  <SelectItem label="2 days before" value="2_day" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <DateTimePickerField
            label="Start"
            time={startTime}
            date={startDate}
            onTimeChange={setStartTime}
            onDateChange={setStartDate}
          />

          <DateTimePickerField
            label="End"
            time={endTime}
            date={endDate}
            onTimeChange={setEndTime}
            onDateChange={setEndDate}
          />

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Note</FormControlLabelText>
            </FormControlLabel>

            <Textarea>
              <TextareaInput
                value={note}
                onChangeText={setNote}
                placeholder="Enter note"
                multiline
              />
            </Textarea>
          </FormControl>
        </VStack>
      </ScrollView>
      {conflictTask && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
          <ModalBackdrop />
          <ModalContent>
          <ModalHeader>
              <Heading size="md" className="text-typography-950">
                  Conflict with Existing Task
              </Heading>
              <ModalCloseButton>
                  <Icon as={CloseIcon} size="md" />
              </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
    <Text size="sm" className="text-typography-500">
        The task you are trying to add overlaps with the following existing task:
    </Text>
    <Text className="mt-4 text-typography-900 font-semibold">
        {conflictTask.title}
    </Text>
    <Text className="text-typography-700">
      Time: {conflictTask.time} - {dayjs(`${dayjs(startDate).format("YYYY-MM-DD")} ${conflictTask.time}`, "YYYY-MM-DD HH:mm")
          .add(parseDuration(conflictTask.duration), "minute")
          .format("HH:mm")} ({conflictTask.duration})
    </Text>
    <Text className="text-typography-700">
        Location: {conflictTask.location}
    </Text>
    {conflictTask.priority && conflictTask.priority !== "none" && (
        <Text className="text-typography-700">
            Priority: {conflictTask.priority}
        </Text>
    )}
    
    {nextAvailableTime && (
      <Text className="mt-4 text-typography-700 font-semibold">
          Suggested Time: {nextAvailableTime.includes(" ") ? 
          dayjs(nextAvailableTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm") : 
          dayjs().format("YYYY-MM-DD") + " " + nextAvailableTime}
      </Text>
  )}
</ModalBody>
<ModalFooter className="flex justify-end gap-2">
    <Button onPress={handleIgnoreConflict}  variant="outline">
        <ButtonText>Ignore Conflict</ButtonText>
    </Button>
    <Button
    onPress={async () => {
        if (nextAvailableTime) {
            const nextAvailableDateTime = dayjs(nextAvailableTime, "YYYY-MM-DD HH:mm");
            const startDateTime = nextAvailableDateTime.format("YYYY-MM-DD");
            const newStartTime = nextAvailableDateTime.format("HH:mm");

            const durationMinutes = dayjs(endTime).diff(dayjs(startTime), "minute");
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            const durationFormatted = 
                hours > 0 && minutes > 0 ? `${hours}h ${minutes}m` :
                hours > 0 ? `${hours}h` :
                `${minutes}m`;

            const newTask: ScheduleItem = {
                time: newStartTime,
                duration: durationFormatted,
                title,
                location,
                priority,
            };

            try {
                const conflict = await addSchedule(startDateTime, newTask, true);
                
                if (conflict) {
                    Alert.alert("Conflict Detected", "The task you are trying to add conflicts with an existing task.");
                    return;
                }

                setShowModal(false);
                router.push("/tabs/schedule-list");
            } catch (error) {
                console.error("Failed to add schedule:", error);
            }
        } else {
            Alert.alert("No Available Time", "Could not find a suitable slot for this task.");
        }
    }}
>
    <ButtonText>Resolve Conflict</ButtonText>
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
  inputBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 14,
    color: "#0f172a",
  },
});