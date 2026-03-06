import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getCustomTimetable,
  postCustomTimetable,
} from "../../apis/user/timetable";
import { CustomTimetableData } from "../types/timetable";

export const CUSTOM_TIMETABLE_QUERY_KEY = "CustomTimetable";

export function useCustomTimetableQuery() {
  return useQuery<CustomTimetableData | null>(
    CUSTOM_TIMETABLE_QUERY_KEY,
    getCustomTimetable,
    { staleTime: 5 * 60 * 1000 }
  );
}

export function useCustomTimetableMutation() {
  const queryClient = useQueryClient();
  return useMutation(postCustomTimetable, {
    onSuccess: () => {
      queryClient.invalidateQueries(CUSTOM_TIMETABLE_QUERY_KEY);
    },
  });
}
