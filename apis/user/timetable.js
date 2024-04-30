import { apiAuthInstance } from "../instance";

export const getCustomTimetable = async () => {
  const { data } = await apiAuthInstance.get("/user/timetable");

  return data;
};

export const postCustomTimetable = async (timetable) => {
  const { data } = await apiAuthInstance.post("/user/timetable", { timetable });

  return data;
};
