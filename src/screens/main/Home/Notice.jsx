import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import moment from "moment";
import { useQuery } from "react-query";
import { getNotices } from "../../../../apis/home/notice";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
import { useState } from "react";

export default function NoticeScreen({ navigation }) {
  const { data, isSuccess, isLoading, refetch } = useQuery(
    "Notice",
    getNotices
  );
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      marginVertical: 14,
      fontWeight: "700",
      marginLeft: 14,
    },
  });
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <Text style={styles.title}>공지사항</Text>

      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            refetch().then(() => {
              setRefreshing(false);
            });
          }}
          renderItem={NoticeItem}
        />
      ) : null}
    </SafeAreaView>
  );
}

function NoticeItem({ item }) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      padding: 18,
      marginBottom: 10,
    },
    title: { fontSize: 16, fontWeight: "700" },
    writer: { marginTop: 2, fontSize: 11, color: "gray" },
    content: { marginTop: 10, fontWeight: "300" },
    createdAt: {
      marginTop: 10,
      fontWeight: "300",
      fontSize: 10,
      color: "#b4b4b4",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.writer}>작성자 : {item.writer}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.createdAt}>
        {moment(item.createdAt).format("YYYY-MM-DD A hh시 mm분")}
      </Text>
    </View>
  );
}
