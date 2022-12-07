import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { comma } from "../../../../utils/intl";

export default function CommunityScreen({ navigation }) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <CommunityItem />
      <CommunityItem />
    </SafeAreaView>
  );
}

function CommunityItem() {
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
    desc: {
      fontSize: 14,
      color: "gray",
      paddingHorizontal: 18,
      marginTop: 18,
      height: 40,
    },
    image_wrap: {
      flexDirection: "row",
      alignItems: "center",
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화
          삼천리 화려 강산 대한 사람 대한 으로 길이 보전하세
        </Text>
        <Text style={styles.time}>10분 전</Text>
      </View>
      <Text style={styles.desc} numberOfLines={2} ellipsizeMode={"tail"}>
        동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화
        삼천리 화려 강산 대한 사람 대한 으로 길이 보전하세 남산 위에 저 소나무
        철갑을 두른 듯
      </Text>
      <View style={styles.image_wrap}>
        <Image
          style={styles.image}
          source={{ uri: "https://static.kch-app.me/3.jpeg" }}
        />
        <Image
          style={styles.image}
          source={{ uri: "https://static.kch-app.me/3.jpeg" }}
        />
        <Image
          style={styles.image}
          source={{ uri: "https://static.kch-app.me/3.jpeg" }}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome name={"heart-o"} size={20} />
          <Text style={styles.icon_text}>{comma(2222)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"chatbubble-outline"} size={20} />
          <Text style={styles.icon_text}>{comma(2231)}</Text>
        </View>
      </View>
    </View>
  );
}
