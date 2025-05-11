import dayjs from 'dayjs';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduleItem {
    time: string;
    duration: string;
    title: string;
    location: string;
    priority?: string;
    __empty?: boolean;
}

interface ScheduleContextType {
    schedules: Record<string, ScheduleItem[]>;
    addSchedule: (date: string, newTask: ScheduleItem, ignoreConflict?: boolean) => ScheduleItem | null;
    removeSchedule: (date: string, taskIndex: number) => void;
    findConflict: (date: string, newTask: ScheduleItem) => ScheduleItem | null;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEY = "SCHEDULES_DATA";

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [schedules, setSchedules] = useState<Record<string, ScheduleItem[]>>({});

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    setSchedules(JSON.parse(storedData));
                } else {
                    const initialData = generateInitialSchedules();
                    setSchedules(initialData);
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
                }
            } catch (error) {
                console.error("Failed to load schedules:", error);
            }
        };

        loadSchedules();
    }, []);

    const saveSchedules = async (data: Record<string, ScheduleItem[]>) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save schedules:", error);
        }
    };

    const generateInitialSchedules = () => {
        const today = dayjs().format("YYYY-MM-DD");
        const endDate = dayjs().add(30, "day").format("YYYY-MM-DD");
        const initialSchedules: Record<string, ScheduleItem[]> = {};

        let currentDate = dayjs(today);
        while (currentDate.isSameOrBefore(endDate)) {
            initialSchedules[currentDate.format("YYYY-MM-DD")] = [];
            currentDate = currentDate.add(1, "day");
        }

        return initialSchedules;
    };

    const parseDuration = (duration: string) => {
        const hourMatch = duration.match(/(\d+(\.\d+)?)h/);
        const minuteMatch = duration.match(/(\d+)m/);
        const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
        return hours * 60 + minutes;
    };

    const findConflict = (date: string, newTask: ScheduleItem) => {
        const tasks = schedules[date] || [];
        const newStartTime = dayjs(`${date} ${newTask.time}`, "YYYY-MM-DD HH:mm", true);
        const durationMinutes = parseDuration(newTask.duration);

        if (!newStartTime.isValid() || durationMinutes <= 0) return null;

        const newEndTime = newStartTime.add(durationMinutes, "minute");

        for (const task of tasks) {
            const taskStartTime = dayjs(`${date} ${task.time}`, "YYYY-MM-DD HH:mm", true);
            const taskDuration = parseDuration(task.duration);
            const taskEndTime = taskStartTime.add(taskDuration, "minute");

            if (
                newStartTime.isBefore(taskEndTime) &&
                newEndTime.isAfter(taskStartTime)
            ) {
                return task;
            }
        }

        return null;
    };

    const addSchedule = (date: string, newTask: ScheduleItem, ignoreConflict = false): ScheduleItem | null => {
        const conflict = findConflict(date, newTask);

        if (conflict && !ignoreConflict) return conflict;

        const updated = { ...schedules };
        updated[date] = [...(updated[date] || []), newTask].sort((a, b) =>
            dayjs(`${date} ${a.time}`, "YYYY-MM-DD HH:mm").isBefore(
                dayjs(`${date} ${b.time}`, "YYYY-MM-DD HH:mm")
            ) ? -1 : 1
        );

        setSchedules(updated);
        saveSchedules(updated);
        return null;
    };

    const removeSchedule = (date: string, taskIndex: number) => {
        const updated = { ...schedules };
        updated[date].splice(taskIndex, 1);
        setSchedules(updated);
        saveSchedules(updated);
    };

    return (
        <ScheduleContext.Provider value={{ schedules, addSchedule, removeSchedule, findConflict }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error("useSchedule must be used within a ScheduleProvider");
    return context;
};

export default ScheduleProvider;