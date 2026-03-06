import { apiAuthInstance } from "../instance";
import { CustomTimetableData } from "../../src/types/timetable";

export const getCustomTimetable = async (): Promise<CustomTimetableData | null> => {
  const { data } = await apiAuthInstance.get<CustomTimetableData | null>(
    "/user/timetable"
  );
  return data;
};

export const postCustomTimetable = async (
  timetable: CustomTimetableData
): Promise<void> => {
  await apiAuthInstance.post("/user/timetable", { timetable });
};
