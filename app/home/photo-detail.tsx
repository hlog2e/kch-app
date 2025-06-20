import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import moment from "moment";
import { useState } from "react";
import ImageView from "react-native-image-viewing";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Simple Header Component for Photo Detail
function PhotoDetailHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
      marginBottom: 6,
    },
    backButtonText: {
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color={colors.text} />
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PhotoDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const data = params as any; // 파라미터 데이터를 직접 사용
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 14 },

    imageTitle: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    createdAt: {
      fontSize: 12,
      color: colors.subText,
      fontWeight: "300",
      marginTop: 2,
    },
    copyright: {
      fontSize: 12,
      marginTop: 6,
      fontWeight: "300",
      color: colors.subText,
    },

    scroll: { paddingHorizontal: 14, marginTop: 12 },
    image: { width: "100%", height: 230, borderRadius: 15, marginBottom: 12 },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <PhotoDetailHeader />
      <View style={styles.header}>
        <Text style={styles.imageTitle}>{data.title}</Text>
        <Text style={styles.createdAt}>
          작성일 : {moment(data.createdAt).format("YYYY-MM-DD")}
        </Text>
        <Text style={styles.copyright}>출처 : 금천고등학교 홈페이지</Text>
      </View>

      <ImageView
        visible={viewerOpen}
        images={
          data.photos?.reduce(
            (acc: any, current: any) => [...acc, { uri: current }],
            []
          ) || []
        }
        imageIndex={imageIndex}
        onRequestClose={() => {
          setViewerOpen(false);
        }}
      />

      <ScrollView style={styles.scroll}>
        {data.photos?.map((photo: any, index: number) => (
          <TouchableOpacity
            onPress={() => {
              setImageIndex(index);
              setViewerOpen(true);
            }}
            key={photo}
          >
            <Image
              transition={500}
              placeholder={"L1O|b2-;fQ-;_3fQfQfQfQfQfQfQ"}
              contentFit="cover"
              style={styles.image}
              source={photo}
            />
          </TouchableOpacity>
        )) || null}
      </ScrollView>
    </SafeAreaView>
  );
}
