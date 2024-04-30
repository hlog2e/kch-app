import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import deniedImage from "../../../../../assets/svgs/community.svg";
import Header from "../../../../components/Header/Header";

export default function AccessDeniedScreen({ navigation, route }) {
  const boardData = route.params.boardData;
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    content_wrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    img: { height: 210, width: 250 },
    text: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 16,
    },
    desc: {
      color: colors.subText,
      fontSize: 14,
      textAlign: "center",
      marginTop: 6,
    },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header navigation={navigation} backArrowText={"커뮤니티"} />

      <View style={styles.content_wrap}>
        <Image style={styles.img} contentFit="contain" source={deniedImage} />
        <Text style={styles.text}>
          {boardData.name} 게시판에 접근 권한이 없습니다!
        </Text>
        <Text style={styles.desc}>{boardData.desc}</Text>
      </View>
    </SafeAreaView>
  );
}
