import { apiAuthInstance } from "../instance";

export const getCustomTimetable = async () => {
  const { data } = await apiAuthInstance.get<unknown>("/user/timetable");
  return data;
};

export const postCustomTimetable = async (timetable: any) => {
  const { data } = await apiAuthInstance.post<unknown>("/user/timetable", {
    timetable,
  });
  return data;
};
