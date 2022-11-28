import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SliderBox } from "react-native-image-slider-box";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeedScreen({ navigation }) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: { paddingVertical: 35, paddingHorizontal: 25 },
    header_text: { fontSize: 45, fontWeight: "700" },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <FeedItem />
    </SafeAreaView>
  );
}

function FeedItem() {
  const TEMP_IMAGE_ARRAY = [
    "https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg",
    "https://images.unsplash.com/photo-1669484179894-4cfb13b51b7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80r",
    "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/310503499_427756022831327_6543903263651309892_n.jpg?stp=dst-jpg_e15&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=111&_nc_ohc=yJ-vnORzONwAX_h10u5&tn=aOvhgLNEF9p1_aaN&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjk0MjAzODUzNDgyMzEwNTQwOA%3D%3D.2-ccb7-5&oh=00_AfBc86-4a4KogZ5ne3pX1bFeRpGcCP3V54ziGtQYbA883g&oe=6388D3C9&_nc_sid=30a2ef",
    "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/310530401_100970476112686_5134544411474815911_n.jpg?stp=dst-jpg_e15&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=n7J-cVTV1hwAX_3XRll&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjk0MjAzODUzNDgyMzE3NDYzNw%3D%3D.2-ccb7-5&oh=00_AfBTmiGDoHeqqQs-W-xR95uobYFT5bPuAkxrsWPo-R7afQ&oe=63884AA2&_nc_sid=30a2ef",
  ];

  const styles = StyleSheet.create({
    container: { backgroundColor: "white", height: 450 },
    header: {
      padding: 12,

      flexDirection: "row",
      alignItems: "center",
    },
    header_icon: { width: 40, height: 40 },
    header_text: { fontSize: 15, fontWeight: "700", marginLeft: 6 },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.header_icon}
          source={require("../../../../assets/adaptive-icon.png")}
        />
        <Text style={styles.header_text}>금천고등학교</Text>
      </View>
      <SliderBox
        sliderBoxHeight={SCREEN_WIDTH}
        images={TEMP_IMAGE_ARRAY}
        imageLoadingColor={"gray"}
        dotColor={"#f4f4f4"}
        inactiveDotColor={"#d4d4d4"}
      />
    </View>
  );
}
