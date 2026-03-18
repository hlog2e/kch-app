import { useWindowDimensions } from "react-native";

const BASE_WIDTH = 390;
const MAX_SCALE = 1.3;

export function useResponsiveScale() {
  const { width } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, MAX_SCALE);
  const s = (size: number) => Math.round(size * scale);
  return { s, scale };
}
