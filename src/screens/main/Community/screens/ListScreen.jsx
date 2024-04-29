import { SafeAreaView } from "react-native-safe-area-context";
import FABPlus from "../../../../components/Button/FABPlus";
import Header from "../../../../components/Header/Header";
import CommunityList from "../components/List/List";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function CommunityInnerListScreen({ route, navigation }) {
  const boardData = route.params.boardData;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Header
        navigation={navigation}
        backArrowText={boardData.name + " 게시판"}
        rightComponent={<RightNotificationSwitch boardData={boardData} />}
      />
      <FABPlus
        onPress={() => {
          navigation.push("CommunityPOSTScreen", { boardData });
        }}
      />
      <CommunityList boardData={boardData} navigation={navigation} />
    </SafeAreaView>
  );
}

function RightNotificationSwitch({ boardData }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center", marginRight: 10 },
    text: { fontSize: 12, color: colors.subText },
    switch: { transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>알림</Text>
      <Switch
        style={styles.switch}
        value={true}
        trackColor={{ true: colors.blue, false: null }}
      />
    </View>
  );
}
