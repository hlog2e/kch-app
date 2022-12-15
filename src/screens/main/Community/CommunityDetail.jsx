import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function CommunityDetailScreen({ navigation, route }) {
  console.log(route.params);
  return (
    <SafeAreaView edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text>커뮤니티 글 디테일 Stack</Text>
    </SafeAreaView>
  );
}
