import { View, StyleSheet, Text, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";

export default function StudentIDScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    card_wrap: {
      flex: 1,
      marginTop: 50,
      paddingHorizontal: 45,
    },
    title: { fontSize: 16, fontWeight: "700", paddingVertical: 7 },
    card: { backgroundColor: "white", borderRadius: 10 },
    image: {
      height: 150,

      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    name_section: {
      marginTop: 30,
      alignItems: "center",
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
    },
    school_name: {
      fontSize: 12,
      fontWeight: "200",
      color: "gray",
      marginTop: 4,
    },
    divider: {
      marginHorizontal: 20,
      marginVertical: 15,
      height: 0.4,
      backgroundColor: "#c4c4c4",
    },
    info_section: {
      paddingHorizontal: 25,
    },
    info_row: {
      paddingVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    info_title: {
      fontSize: 12,
      fontWeight: "600",
      color: "gray",
    },
    info_text: {
      fontSize: 14,
      fontWeight: "600",
    },
    logo_row: {
      justifyContent: "center",
      paddingVertical: 10,
    },
    logo: { height: 40, marginVertical: 10 },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <OnlyLeftArrowHeader navigation={navigation} />

      <View style={styles.card_wrap}>
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{ uri: "https://static.kch-app.me/student_id_banner.png" }}
          />
          <View style={styles.name_section}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.school_name}>청주 금천고등학교</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.info_section}>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>나이</Text>
              <Text style={styles.info_text}>
                {user.grade === "1" ? "17" : null}
                {user.grade === "2" ? "18" : null}
                {user.grade === "3" ? "19" : null}세
              </Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>학년</Text>
              <Text style={styles.info_text}>{user.grade}학년</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>반</Text>
              <Text style={styles.info_text}>{user.class}반</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>번호</Text>
              <Text style={styles.info_text}>{user.number}번</Text>
            </View>
            <View style={styles.info_row}>
              <Text style={styles.info_title}>유효기간</Text>
              <Text style={styles.info_text}>
                {moment().add("1", "y").format("YYYY") + "-03-01"}
              </Text>
            </View>
            <View style={styles.logo_row}>
              <Image
                resizeMode={"contain"}
                style={styles.logo}
                source={{ uri: "https://static.kch-app.me/logo_title.jpeg" }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
