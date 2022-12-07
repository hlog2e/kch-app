import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native";
import { SliderBox } from "react-native-image-slider-box";

import { useState } from "react";
import ImageZoomModal from "../../../components/common/ImageZoomModal";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
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

  const handleModalOpen = (_images) => {
    let urlConvertedArray = [];
    _images.map((_item) => urlConvertedArray.push({ url: _item }));
    setModalImages(urlConvertedArray);
    setModalOpen(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: { paddingVertical: 35, paddingHorizontal: 25 },
    header_text: { fontSize: 45, fontWeight: "700" },
  });
  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <FlatList
          data={DUMMY_FEEDITEMS}
          renderItem={(_prevState) => (
            <FeedItem
              item={_prevState.item}
              handleModalOpen={handleModalOpen}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
      <ImageZoomModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        images={modalImages}
      />
    </>
  );
}

function FeedItem({ item, handleModalOpen }) {
  const styles = StyleSheet.create({
    container: { backgroundColor: "white", marginTop: 10 },
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
      <SliderBox
        onCurrentImagePressed={() => {
          handleModalOpen(item.images);
        }}
        sliderBoxHeight={SCREEN_WIDTH}
        images={item.images}
        imageLoadingColor={"gray"}
        dotColor={"#f4f4f4"}
        inactiveDotColor={"#d4d4d4"}
      />
    </View>
  );
}