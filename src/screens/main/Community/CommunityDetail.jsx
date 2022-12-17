import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function CommunityDetailScreen({ navigation, route }) {
  console.log(route.params);

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "600",
    },
  });
  return (
    <SafeAreaView edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text style={styles.title}>커뮤니티 글 디테일 Stack</Text>
    </SafeAreaView>
  );
}
