import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import ImageView from "react-native-image-viewing";

interface HorizontalScrollImageViewProps {
  data: string[];
  height?: number;
}

export default function HorizontalScrollImageView({
  data,
  height,
}: HorizontalScrollImageViewProps) {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [imageUris, setImageUris] = useState<{ uri: string }[]>([]);

  const handleImageOpen = (index: number): void => {
    const uris = data.map((uri) => ({ uri }));
    setImageUris(uris);
    setImageIndex(index);
    setImageOpen(true);
  };

  const styles = StyleSheet.create({
    image_container: {
      flexDirection: "row",
      paddingVertical: 10,
    },
    image: {
      height: height ?? 100,
      aspectRatio: 1,
      borderRadius: 18,
      marginRight: 8,
      backgroundColor: "#f9f9f9",
    },
  });

  return (
    <ScrollView horizontal style={styles.image_container}>
      {data.map((uri, i) => (
        <TouchableOpacity onPress={() => handleImageOpen(i)} key={uri}>
          <Image
            style={styles.image}
            placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
            transition={500}
            source={{ uri }}
          />
        </TouchableOpacity>
      ))}
      <ImageView
        visible={imageOpen}
        images={imageUris}
        imageIndex={imageIndex}
        onRequestClose={() => setImageOpen(false)}
      />
    </ScrollView>
  );
}
