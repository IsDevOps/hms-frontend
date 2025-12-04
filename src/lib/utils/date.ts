import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  startOfDay,
} from 'date-fns';
import { DateTime } from 'luxon';

const calculateDate = (
  startDate: Date | string,
  count: number
): { date: string; isoDate: string } => {
  const baseDate = new Date(startDate);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (isNaN(count) || count < 0) {
    return {
      date: DateTime.fromJSDate(baseDate)
        .setZone(timezone)
        .toFormat('yyyy-MM-dd'),
      isoDate: baseDate.toISOString(),
    };
  }

  const doseDate = addDays(baseDate, count);
  const localDate = DateTime.fromJSDate(doseDate).setZone(timezone);

  return {
    date: localDate.toFormat('yyyy-MM-dd'),
    isoDate: baseDate.toISOString(),
  };
};

const calculateDaysLeft = (endDate: string | Date): number => {
  const todayUtc = startOfDay(new Date());
  const endUtc = startOfDay(new Date(endDate));
  const daysLeft = differenceInCalendarDays(endUtc, todayUtc);

  return Math.max(daysLeft + 1, 0);
};

const computeEndDate = (startDate: string, days: number): string => {
  const start = new Date(startDate);
  const end = endOfDay(addDays(start, days - 1));
  return end.toISOString();
};

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const formatLocalTime = (date: string | Date = new Date()): string => {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Set to false for 24-hour format
  }).format(new Date(date));
};

const generateTimeSlots = (timesPerDay: number): string[] => {
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  const interval = (endHour - startHour) / (timesPerDay - 1);

  const slots: string[] = [];

  for (let i = 0; i < timesPerDay; i++) {
    const hour = startHour + i * interval;
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    slots.push(formattedTime);
  }

  return slots;
};

const getISODate = (date?: Date): string => {
  const baseDate = date ?? new Date();

  return baseDate.toISOString();
};

const sortByCreatedAt = (createdAt1: string, createdAt2: string): number => {
  const date1 = new Date(createdAt1).getTime();
  const date2 = new Date(createdAt2).getTime();

  return date2 - date1;
};

export {
  calculateDate,
  calculateDaysLeft,
  computeEndDate,
  formatCountdown,
  formatLocalTime,
  generateTimeSlots,
  getISODate,
  sortByCreatedAt,
};
