import "@react-navigation/native";

declare module "@react-navigation/native" {
  export interface Theme {
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      // 커스텀 색상들
      blue: string;
      cardBg: string;
      cardBg2: string;
      icon: string;
      red: string;
      subText: string;
    };
  }
}
