import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function NotificationScreen({ navigation }) {
  console.log(navigation);
  if (!navigation.goBack) {
    console.log("없음");
  }
  return (
    <SafeAreaView>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text></Text>
    </SafeAreaView>
  );
}
