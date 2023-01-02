import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import moment from "moment";
import ImageModal from "react-native-image-modal";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function CommunityDetailScreen({ navigation, route }) {
  const data = route.params.item;

  const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },
    wrap: { padding: 20, backgroundColor: "white" },
    title: {
      fontSize: 24,
      fontWeight: "600",
    },
    date: {
      fontSize: 12,
      color: "gray",
    },
    content: {
      marginTop: 24,
      fontSize: 14,
      color: "#52525b",
    },
    image: {
      width: 200,
      height: 200,
      marginRight: 20,
      borderRadius: 20,
      marginTop: 32,
    },
    button_bar: {
      marginTop: 20,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    button_text: { fontSize: 12, paddingHorizontal: 10 },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />
      <ScrollView style={{ backgroundColor: "#f4f4f4" }}>
        <View style={styles.wrap}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.date}>{moment(data.createdAt).fromNow()}</Text>
          <Text style={styles.content}>{data.content}</Text>
          <ScrollView horizontal>
            {data.images.map((_item) => (
              <ImageModal
                style={styles.image}
                resizeMode={"contain"}
                source={{
                  uri: _item,
                }}
              />
            ))}
          </ScrollView>
          <View style={styles.button_bar}>
            <TouchableOpacity style={styles.button}>
              <FontAwesome name={"heart-o"} size={20} />
              <Text style={styles.button_text}>200</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Ionicons name={"chatbubble-outline"} size={20} />
              <Text style={styles.button_text}>200</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
