import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { comma } from "../../../../utils/intl";
import moment from "moment";
import "moment/locale/ko";

export default function CommunityScreen({ navigation }) {
  const DUMMY_DATA = [
    {
      _id: "adslfnlnel2pdn",
      title: "제목입니다. 가나다라마바사아자차카타파하",
      content:
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 강산 대한 사람 대한 으로 길이 보전하세 남산 위에 저 소나무 철갑을 두른 듯",
      like_count: 2330,
      comment_count: 2403,
      images: [
        "https://static.kch-app.me/3.jpeg",
        "https://static.kch-app.me/2.jpeg",
        "https://static.kch-app.me/1.jpeg",
      ],
      createAt: 1671093665,
    },
    {
      _id: "adslfnlnel2pdnlkjlj",
      title: "제목입니다. 가나다라마바사아자차카타파하",
      content:
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 강산 대한 사람 대한 으로 길이 보전하세 남산 위에 저 소나무 철갑을 두른 듯",
      like_count: 2330,
      comment_count: 2403,
      images: [
        "https://static.kch-app.me/3.jpeg",
        "https://static.kch-app.me/2.jpeg",
        "https://static.kch-app.me/1.jpeg",
      ],
      createAt: 1671093665,
    },
    {
      _id: "adslfnl222nel2pdn",
      title: "제목입니다. 가나다라마바사아자차카타파하",
      content:
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 강산 대한 사람 대한 으로 길이 보전하세 남산 위에 저 소나무 철갑을 두른 듯",
      like_count: 2330,
      comment_count: 2403,
      images: [
        "https://static.kch-app.me/3.jpeg",
        "https://static.kch-app.me/2.jpeg",
        "https://static.kch-app.me/1.jpeg",
      ],
      createAt: 1671093665,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        data={DUMMY_DATA}
        renderItem={(_item) => {
          return <CommunityItem item={_item.item} navigation={navigation} />;
        }}
        keyExtractor={(_item) => _item._id}
      />
    </SafeAreaView>
  );
}

function CommunityItem({ item, navigation }) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      marginTop: 8,
    },
    header: { marginTop: 30, paddingHorizontal: 18 },
    title: {
      fontSize: 20,
      fontWeight: "600",
    },
    time: { fontSize: 12, color: "#b4b4b4", marginTop: 4 },
    content: {
      fontSize: 14,
      color: "gray",
      paddingHorizontal: 18,
      marginTop: 18,
      height: 40,
    },
    image_scroll: {
      height: 90,
      marginTop: 18,
      paddingHorizontal: 18,
    },
    image: { height: 80, width: 80, borderRadius: 15, marginRight: 8 },
    footer: {
      flexDirection: "row",
      height: 50,

      paddingHorizontal: 18,
    },
    icon_wrap: { flexDirection: "row", alignItems: "center" },
    icon_text: { fontSize: 12, marginLeft: 6, color: "#b4b4b4" },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("CommunityDetailScreen", { item: item });
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          {item.title}
        </Text>
        <Text style={styles.time}>{moment.unix(item.createAt).fromNow()}</Text>
      </View>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>
        {item.content}
      </Text>
      <ScrollView horizontal={true} style={styles.image_scroll}>
        {item.images.map((_item) => (
          <Image key={_item} style={styles.image} source={{ uri: _item }} />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome name={"heart-o"} size={20} />
          <Text style={styles.icon_text}>{comma(item.like_count)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"chatbubble-outline"} size={20} />
          <Text style={styles.icon_text}>{comma(item.comment_count)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
