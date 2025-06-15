import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import { getUserInfo } from "../../../apis/user/index";
import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function HeaderSection() {
  const { data } = useQuery("UserData", getUserInfo);
  const { user, update } = useUser();
  const router = useRouter();

  const { colors } = useTheme();

  // 랜더링 될때 만약 서버에 있는 User Data의 Mutate가 있다면 로컬에 있는 데이터도 Update
  useEffect(() => {
    if (data) {
      if (JSON.stringify(user) !== JSON.stringify(data)) {
        update({ user: data });
      }
    }
  }, [data]);

  const styles = StyleSheet.create({
    header: { marginTop: 30, flexDirection: "row" },
    photo: { width: 60, height: 60, borderRadius: 50 },
    rightWrap: {
      marginLeft: 12,
      justifyContent: "space-between",
      paddingTop: 4,
    },
    nameText: { fontSize: 18, fontWeight: "700", color: colors.text },
    descText: {
      fontSize: 12,
      fontWeight: "300",
      color: colors.subText,
      marginTop: 2,
    },
    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    editProfileButtonText: {
      fontWeight: "200",
      fontSize: 12,
      color: colors.subText,
    },
  });

  return (
    <View style={styles.header}>
      {user?.profilePhoto ? (
        <Image
          style={styles.photo}
          source={user.profilePhoto}
          transition={500}
          contentFit={"contain"}
        />
      ) : (
        <Ionicons name="person-circle" size={60} color={"#d9d9d9"} />
      )}

      <View style={styles.rightWrap}>
        <Text style={styles.nameText}>{user?.name}</Text>
        <Text style={styles.descText}>{user?.desc}</Text>
        <TouchableOpacity
          onPress={() => router.push("/more/edit-profile")}
          style={styles.editProfileButton}
        >
          <Text style={styles.editProfileButtonText}>프로필 수정</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
