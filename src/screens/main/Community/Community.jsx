import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCommunityBoardFixeds,
  getCommunityBoards,
  postCommunityBoardFix,
  postCommunityBoardUnFix,
} from "../../../../apis/community/community";

export default function CommunityScreen({ navigation }) {
  const { data: boardData } = useQuery("CommunityBoard", getCommunityBoards, {
    initialData: [],
  });
  const { data: fixedBoardData } = useQuery(
    "CommunityBoardFixed",
    getCommunityBoardFixeds,
    { initialData: [] }
  );
  const { mutate: fixMutate } = useMutation(postCommunityBoardFix);
  const { mutate: unFixMutate } = useMutation(postCommunityBoardUnFix);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    title: { fontWeight: "700", fontSize: 24, marginTop: 14, marginBottom: 6 },
    scroll: {
      flex: 1,
    },

    banner: {
      marginVertical: 12,
      height: 100,
      borderRadius: 12,
      backgroundColor: "#f4f4f4",
    },
    tip: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      backgroundColor: "#f4f4f4",
      borderRadius: 12,
    },
    tipText: {
      fontSize: 12,
      color: "gray",
      fontWeight: "600",
    },

    divider: {
      marginVertical: 12,
      borderWidth: 0.5,
      borderColor: "#e2e8f0",
    },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Text style={styles.title}>커뮤니티</Text>
      <ScrollView style={styles.scroll}>
        <View style={styles.banner}></View>
        {!fixedBoardData || fixedBoardData.length === 0 ? (
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              팁: 게시판 항목을 길게 누르면 고정 할 수 있습니다.
            </Text>
          </View>
        ) : null}
        {fixedBoardData && boardData ? (
          <FixedList
            fixedData={fixedBoardData}
            boardData={boardData}
            navigation={navigation}
            unFixMutate={unFixMutate}
          />
        ) : null}

        <View style={styles.divider} />
        {boardData ? (
          <UnFixedList
            fixedData={fixedBoardData}
            boardData={boardData}
            navigation={navigation}
            fixMutate={fixMutate}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function FixedList({ fixedData, boardData, navigation, unFixMutate }) {
  const queryClient = useQueryClient();
  const filteredData = boardData.filter((_item) =>
    fixedData.includes(_item._id)
  );
  return filteredData.map((_data) => (
    <BoardItem
      key={_data._id}
      onPress={() => {
        navigation.push("CommunityInnerListScreen", {
          boardId: _data._id,
        });
      }}
      onLongPress={() => {
        unFixMutate(
          { boardId: _data._id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("CommunityBoardFixed");
            },
          }
        );
      }}
      iconName={_data.iconName}
      text={_data.name + " 게시판"}
    />
  ));
}

function UnFixedList({ fixedData, boardData, navigation, fixMutate }) {
  const queryClient = useQueryClient();
  const filteredData = boardData.filter(
    (_item) => !fixedData.includes(_item._id)
  );

  return filteredData.map((_data) => (
    <BoardItem
      key={_data._id}
      onPress={() => {
        navigation.push("CommunityInnerListScreen", {
          boardId: _data._id,
        });
      }}
      onLongPress={() => {
        fixMutate(
          { boardId: _data._id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("CommunityBoardFixed");
            },
          }
        );
      }}
      iconName={_data.iconName}
      text={_data.name + " 게시판"}
    />
  ));
}

function BoardItem({ onPress, iconName, text, onLongPress }) {
  const styles = StyleSheet.create({
    button: {
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    buttonText: {
      marginLeft: 12,
      fontSize: 16,
      fontWeight: "600",
    },
  });
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.button}
    >
      <Ionicons name={iconName} size={24} color="#60a5fa" />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}
