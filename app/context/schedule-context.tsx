import dayjs from 'dayjs';
import React, { createContext, ReactNode, useContext, useState } from 'react';

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

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const today = dayjs().format("YYYY-MM-DD");
    const endDate = dayjs().add(30, "day").format("YYYY-MM-DD");

    const generateInitialSchedules = () => {
        const schedules: Record<string, ScheduleItem[]> = {};
        let currentDate = dayjs(today);

        while (currentDate.isSameOrBefore(endDate)) {
            schedules[currentDate.format("YYYY-MM-DD")] = [];
            currentDate = currentDate.add(1, "day");
        }

        schedules[today] = [
            { time: "09:00", duration: "1h", title: "Gym", location: "Gym" },
            { time: "12:00", duration: "2h", title: "Class 2", location: "Room 5005" },
            { time: "14:00", duration: "1h", title: "Lunch", location: "Cafeteria" },
            { time: "15:00", duration: "2h", title: "Class 3", location: "Room 6201" },
            { time: "18:00", duration: "2h", title: "Do groceries", location: "Supermarket" },
        ];
        
        schedules[dayjs(today).add(1, "day").format("YYYY-MM-DD")] = [
            { time: "10:00", duration: "2h", title: "Class 1", location: "Room 5001" },
            { time: "13:00", duration: "1h", title: "Project Meeting", location: "Zoom" },
            { time: "14:30", duration: "1.5h", title: "Library Study", location: "Library - 2F" },
            { time: "16:30", duration: "1h", title: "Coffee Break", location: "Cafe Bliss" },
            { time: "18:00", duration: "2h", title: "Dinner with Team", location: "Sushi House" },
        ];

        return schedules;
    };

    const [schedules, setSchedules] = useState(generateInitialSchedules());

    const parseDuration = (duration: string) => {
        const hourMatch = duration.match(/(\d+(\.\d+)?)h/);
        const minuteMatch = duration.match(/(\d+)m/);
        const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
        const totalMinutes = Math.round(hours * 60) + minutes;
        return totalMinutes > 0 ? totalMinutes : -1;
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
    
        setSchedules((prev) => {
            const updated = { ...prev };
            
            updated[date] = [...(updated[date] || []), newTask].sort((a, b) =>
                dayjs(`${date} ${a.time}`, "YYYY-MM-DD HH:mm").isBefore(
                    dayjs(`${date} ${b.time}`, "YYYY-MM-DD HH:mm")
                ) ? -1 : 1
            );
    
            return updated;
        });
    
        return null;
    };

    const removeSchedule = (date: string, taskIndex: number) => {
        setSchedules((prev) => {
            const updated = { ...prev };
            updated[date].splice(taskIndex, 1);
            return updated;
        });
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