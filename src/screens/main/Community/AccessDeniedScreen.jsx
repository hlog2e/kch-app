import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function AccessDeniedScreen() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 70,
    },

    img: { height: 210, width: 250 },
    text: {
      color: colors.subText,
      fontWeight: "700",
      fontSize: 14,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.img}
        contentFit="contain"
        source={require("../../../../assets/svgs/community.svg")}
      />

      <Text style={styles.text}>커뮤니티는 재학생만 이용 가능합니다:)</Text>
    </SafeAreaView>
  );
}
