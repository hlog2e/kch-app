import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function NotificationScreen({ navigation }) {
  return (
    <SafeAreaView>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text>알림센터</Text>
    </SafeAreaView>
  );
}
