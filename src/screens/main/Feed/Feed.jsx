import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import ImageModal from "react-native-image-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const DUMMY_FEEDITEMS = [
    {
      _id: "dfsdfalndkxdla",
      publisher: "금천고등학교 학생회",
      images: [
        "https://static.kch-app.me/1.jpeg",
        "https://static.kch-app.me/2.jpeg",
        "https://static.kch-app.me/3.jpeg",
      ],
    },
    {
      _id: "dfsdfalnd22kxdla",
      publisher: "금천고등학교 학생회2",
      images: [
        "https://static.kch-app.me/2.jpeg",
        "https://static.kch-app.me/1.jpeg",
        "https://static.kch-app.me/3.jpeg",
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={DUMMY_FEEDITEMS}
        renderItem={(_prevState) => <FeedItem item={_prevState.item} />}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}

function FeedItem({ item }) {
  const [activeSnapIndex, setActiveSnapIndex] = useState(0);
  const styles = StyleSheet.create({
    container: { backgroundColor: "white", marginBottom: 10 },
    header: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    header_icon: { width: 40, height: 40 },
    header_text: { fontSize: 15, fontWeight: "700", marginLeft: 6 },

    footer: { height: 45, flexDirection: "row", alignItems: "center" },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.header_icon}
          source={require("../../../../assets/adaptive-icon.png")}
        />
        <Text style={styles.header_text}>{item.publisher}</Text>
      </View>

      <Carousel
        data={item.images}
        onSnapToItem={(_index) => setActiveSnapIndex(_index)}
        renderItem={({ item: image }) => {
          return (
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#FFFFFF"
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
              }}
              source={{ uri: image }}
            />
          );
        }}
        itemWidth={SCREEN_WIDTH}
        sliderWidth={SCREEN_WIDTH}
      />
      <Pagination
        activeDotIndex={activeSnapIndex}
        dotsLength={item.images.length}
      />
    </View>
  );
}
