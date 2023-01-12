import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function NoticeScreen({ navigation }) {
  return (
    <SafeAreaView>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text>알림센터</Text>
    </SafeAreaView>
  );
}
