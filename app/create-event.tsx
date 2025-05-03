import React, { useState } from "react";
import { useRouter } from "expo-router";
import dayjs from 'dayjs';
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import Header from "@/components/ui/header";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { ChevronDownIcon } from "@/components/ui/icon";
import {
    Select, 
    SelectTrigger,
    SelectItem ,
    SelectContent,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
  } from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import DateTimePickerField from "@/components/ui/date-time-selector";

export default function CreateEventScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("none");
  const [note, setNote] = useState("");
  const [repeat, setRepeat] = useState("never");
  const [alert, setAlert] = useState("none");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const handleAdd = () => {
    console.log("Event Title:", title);
    console.log("Location:", location);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Create Event"
        onAdd={handleAdd}
        onBack={() => router.push("/tabs/schedule-list")}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <VStack space="md">
          {/* Title Field */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Title</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={title}
                onChangeText={setTitle}
                placeholder="Enter location"
              />
            </Input>
          </FormControl>

          {/* Location Field */}
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