import "@react-navigation/native";

declare module "@react-navigation/native" {
  export function useTheme(): import("@react-navigation/native").Theme & {
    colors: import("@react-navigation/native").Theme["colors"] & {
      blue: string;
      cardBg: string;
      cardBg2: string;
      icon: string;
      red: string;
      subText: string;
      accentBlueBg: string;
      accentBlueBorder: string;
      accentBlue: string;
      accentBlueSoft: string;
      accentBlueAlpha: string;
      tabBarBg: string;
      inputBorder: string;
      buttonBg: string;
      placeholderBg: string;
      switchTrackOn: string;
      switchTrackOff: string;
    };
  };
}
