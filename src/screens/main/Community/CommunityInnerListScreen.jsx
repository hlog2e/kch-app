import { SafeAreaView } from "react-native-safe-area-context";
import FABPlus from "../../../components/Button/FABPlus";
import Header from "../../../components/Header/Header";
import CommunityList from "./components/CommunityList/CommunityList";

export default function CommunityInnerListScreen({ route, navigation }) {
  const boardData = route.params.boardData;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Header
        navigation={navigation}
        backArrowText={boardData.name + " 게시판"}
      />
      <FABPlus
        onPress={() => {
          navigation.push("CommunityPOSTScreen");
        }}
      />
      <CommunityList boardData={boardData} navigation={navigation} />
    </SafeAreaView>
  );
}
