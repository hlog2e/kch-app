export interface PeriodTime {
  period: number;
  startTime: string; // "HH:mm"
  endTime: string;
  label: string;
}

export const PERIOD_TIMES: PeriodTime[] = [
  { period: 1, startTime: "08:40", endTime: "09:30", label: "1교시" },
  { period: 2, startTime: "09:40", endTime: "10:30", label: "2교시" },
  { period: 3, startTime: "10:40", endTime: "11:30", label: "3교시" },
  { period: 4, startTime: "12:30", endTime: "13:20", label: "4교시" },
  { period: 5, startTime: "13:30", endTime: "14:20", label: "5교시" },
  { period: 6, startTime: "14:30", endTime: "15:20", label: "6교시" },
  { period: 7, startTime: "15:30", endTime: "16:20", label: "7교시" },
  { period: 8, startTime: "16:30", endTime: "17:20", label: "8교시" },
];

export const LUNCH_TIME = {
  startTime: "11:30",
  endTime: "12:30",
  label: "점심",
};

export const LUNCH_AFTER_PERIOD = 3;
