import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import ImageView from "react-native-image-viewing";

export default function HorizontalScrollImageView({ data, height }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUris, setImageUris] = useState([]);

  const handleImageOpen = (_index) => {
    let _tempArray = [];
    data.map((_imageUri) => {
      _tempArray.push({ uri: _imageUri });
    });
    setImageUris(_tempArray);
    setImageIndex(_index);
    setImageOpen(true);
  };

  const styles = StyleSheet.create({
    image_container: {
      flexDirection: "row",
      paddingVertical: 10,
    },
    image: {
      height: height ? height : 100,
      aspectRatio: "1/1",
      borderRadius: 18,
      marginRight: 8,
      backgroundColor: "#f9f9f9",
    },
  });

  return (
    <ScrollView horizontal style={styles.image_container}>
      {data.map((_item, i) => (
        <TouchableOpacity onPress={() => handleImageOpen(i)} key={_item}>
          <Image
            style={styles.image}
            placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
            transition={500}
            source={{ uri: _item }}
          />
        </TouchableOpacity>
      ))}
      <ImageView
        visible={imageOpen}
        images={imageUris}
        imageIndex={imageIndex}
        onRequestClose={() => {
          setImageOpen(false);
        }}
      />
    </ScrollView>
  );
}
