import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomTimetable,
  postCustomTimetable,
} from "../../apis/user/timetable";
import { CustomTimetableData } from "../types/timetable";

export const CUSTOM_TIMETABLE_QUERY_KEY = "CustomTimetable";

export function useCustomTimetableQuery() {
  return useQuery<CustomTimetableData | null>({
    queryKey: [CUSTOM_TIMETABLE_QUERY_KEY],
    queryFn: getCustomTimetable,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomTimetableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCustomTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOM_TIMETABLE_QUERY_KEY] });
    },
  });
}
