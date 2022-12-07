import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

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
    header: { flexDirection: "row", marginTop: 30, alignItems: "flex-end" },
    time: { fontSize: 12, color: "#b4b4b4", marginLeft: 8 },
    title: {
      fontSize: 20,
      fontWeight: "600",
      marginLeft: 18,
    },
    desc: {
      fontSize: 14,
      color: "gray",
      paddingHorizontal: 18,
      marginTop: 18,
      maxHeight: 50,
    },
    image_wrap: {
      justifyContent: "center",
      height: 90,
      marginTop: 18,
    },
    image: { height: 80, width: 80, borderRadius: 15, marginLeft: 18 },
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
        <Text style={styles.title}>타이틀</Text>
        <Text style={styles.time}>10분 전</Text>
      </View>
      <Text style={styles.desc}>
        가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하
      </Text>
      <View style={styles.image_wrap}>
        <Image
          style={styles.image}
          source={{ uri: "https://static.kch-app.me/3.jpeg" }}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome name={"heart-o"} size={20} />
          <Text style={styles.icon_text}>1,218</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"chatbubble-outline"} size={20} />
          <Text style={styles.icon_text}>1,218</Text>
        </View>
      </View>
    </View>
  );
}
