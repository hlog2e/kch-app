import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import moment from "moment";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import { useState } from "react";

export default function CommunityDetailScreen({ navigation, route }) {
  const data = route.params.item;

  const [imageIndex, setImageIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const handleImageOpen = (index) => {
    let _temp = [];
    data.images.map((_i) => {
      _temp.push({ uri: _i });
    });
    setImageUris(_temp);
    setImageIndex(index);
    setImageOpen(true);
  };

  const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },

    scroll_view_wrap: { flex: 1 },
    scroll_view: { backgroundColor: "#f4f4f4", height: 100 },
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
    input_container: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopColor: "#b8b8b8",
      borderTopWidth: 0.2,
    },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <OnlyLeftArrowHeader navigation={navigation} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.scroll_view_wrap}>
          <ScrollView style={styles.scroll_view}>
            <View style={styles.wrap}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.date}>
                {moment(data.createdAt).fromNow()}
              </Text>
              <Text style={styles.content}>{data.content}</Text>
              <ScrollView horizontal>
                {data.images.map((_item, _index) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleImageOpen(_index);
                    }}
                  >
                    <Image
                      style={styles.image}
                      resizeMode={"cover"}
                      source={{
                        uri: _item,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.button_bar}>
                <TouchableOpacity style={styles.button}>
                  <FontAwesome name={"heart-o"} size={20} />
                  <Text style={styles.button_text}>{data.likeCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Ionicons name={"chatbubble-outline"} size={20} />
                  <Text style={styles.button_text}>{data.commentCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.input_container}>
          <TextInput placeholder="댓글을 입력해주세요." multiline />
          <TouchableOpacity>
            <Text>작성</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ImageView
        visible={imageOpen}
        images={imageUris}
        imageIndex={imageIndex}
        onRequestClose={() => {
          setImageOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
