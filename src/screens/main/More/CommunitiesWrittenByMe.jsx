import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { getCommunitiesWrittenByMe } from "../../../../apis/more/more";
import FullScreenLoader from "../../../components/Overlay/FullScreenLoader";
import moment from "moment";

import { comma } from "../../../../utils/intl";
import { useState } from "react";
import Header from "../../../components/Header/Header";

export default function CommunitiesWrittenByMeScreen({ navigation }) {
  const { colors } = useTheme();

  const { data, isLoading, isSuccess, refetch } = useQuery(
    "CommunitiesWrittenByMe",
    getCommunitiesWrittenByMe
  );
  const [onRefreshing, setOnRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    header_title: {
      fontSize: 24,
      paddingVertical: 18,
      marginLeft: 20,
      fontWeight: "700",
      color: colors.text,
    },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header navigation={navigation} />
      <Text style={styles.header_title}>내가 작성한 글</Text>

      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          refreshing={onRefreshing}
          onRefresh={() => {
            setOnRefreshing(true);
            refetch().then(() => {
              setOnRefreshing(false);
            });
          }}
          renderItem={({ item }) => {
            return (
              <TouchableCommunityItem item={item} navigation={navigation} />
            );
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

function TouchableCommunityItem({ item, navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    item: {
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: colors.border,
      marginBottom: 6,
      padding: 14,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    content: {
      fontSize: 14,
      marginTop: 14,
      color: colors.subText,
    },
    datetime: { fontSize: 11, color: "gray", marginTop: 14 },
  });
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.push("CommunityDetailScreen", { id: item._id });
      }}
    >
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.row}>
        <Text style={styles.datetime}>
          작성일시 : {moment(item.createdAt).format("YYYY년 M월 D일 hh시 mm분")}
        </Text>
        <Text style={styles.datetime}>
          조회수 : {item.views ? comma(item.views.length) : 0}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
