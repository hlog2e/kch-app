import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TimetableMode = "neis" | "custom";

const STORAGE_KEY = "timetableMode";

export function useTimetableMode() {
  const [mode, setModeState] = useState<TimetableMode>("neis");
  const [isLoading, setIsLoading] = useState(true);

  const loadMode = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "neis" || stored === "custom") {
        setModeState(stored);
      }
    } catch (error) {
      console.error("Failed to load timetable mode:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMode();
  }, [loadMode]);

  const setMode = useCallback(async (newMode: TimetableMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Failed to save timetable mode:", error);
    }
  }, []);

  const refresh = useCallback(() => {
    loadMode();
  }, [loadMode]);

  return { mode, setMode, isLoading, refresh };
}
