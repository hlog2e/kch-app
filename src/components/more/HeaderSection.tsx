import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../../apis/user/index";
import { useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function HeaderSection() {
  const { data } = useQuery({ queryKey: ["UserData"], queryFn: getUserInfo });
  const { user, update } = useUser();
  const router = useRouter();

  const { colors, dark } = useTheme();

  // 랜더링 될때 만약 서버에 있는 User Data의 Mutate가 있다면 로컬에 있는 데이터도 Update
  useEffect(() => {
    if (data) {
      if (JSON.stringify(user) !== JSON.stringify(data)) {
        update({ user: data });
      }
    }
  }, [data]);

  const getTypeColor = (type: string) => {
    if (type === "graduate") return "#16a34a";
    return "#3b82f6";
  };

  const typeColor = getTypeColor(user?.type ?? "");
  const isVerifiedType =
    user?.type === "undergraduate" ||
    user?.type === "graduate" ||
    user?.type === "teacher";

  const getInfoBoxTitle = (type: string) => {
    if (type === "undergraduate") return "재학생";
    if (type === "graduate") return "졸업생";
    if (type === "teacher") return "선생님";
    return "금천인 인증";
  };

  const getInfoBoxSubtitle = (type: string) => {
    if (type === "undergraduate")
      return `${Number(user?.birthYear) + 16}년도 입학생입니다.`;
    if (type === "graduate")
      return `${Number(user?.birthYear) + 19}년도 졸업생입니다.`;
    if (type === "teacher") return "선생님입니다";
    return "재학생, 졸업생, 선생님이신가요?";
  };

  const styles = StyleSheet.create({
    header: { marginTop: 30, alignItems: "center" },
    photo: { width: 80, height: 80, borderRadius: 40 },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    nameText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    infoBox: {
      alignSelf: "stretch",
      borderRadius: 14,
      backgroundColor: dark
        ? typeColor + "26"
        : typeColor + "14",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginTop: 14,
    },
    infoBoxTextArea: {
      marginLeft: 10,
    },
    infoBoxTitle: {
      fontSize: 13,
      fontWeight: 900,
      color: typeColor,
    },
    infoBoxSubtitle: {
      fontSize: 11,
      fontWeight: "400",
      color: typeColor + "B3",
      marginTop: 4,
    },
    descText: {
      fontSize: 13,
      fontWeight: "300",
      color: colors.subText,
      marginTop: 4,
    },
    buttonRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      gap: 8,
    },
    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: dark ? "#2a2a2a" : "#f0f0f0",
    },
    editProfileButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.text,
      marginLeft: 4,
    },
    studentIdButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#000000",
    },
    studentIdButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#ffffff",
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.header}>
      {user?.profilePhoto ? (
        <Image
          style={styles.photo}
          source={user.profilePhoto}
          transition={500}
          contentFit={"cover"}
        />
      ) : (
        <Ionicons name="person-circle" size={80} color={"#d9d9d9"} />
      )}

      <View style={styles.nameRow}>
        <Text style={styles.nameText}>{user?.name}</Text>
        {isVerifiedType && (
          <MaterialIcons
            name="verified"
            size={18}
            color={typeColor}
            style={{ marginLeft: 3 }}
          />
        )}
      </View>
      {user?.desc ? <Text style={styles.descText}>{user.desc}</Text> : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => router.push("/more/edit-profile")}
          style={styles.editProfileButton}
        >
          <Ionicons name="create-outline" size={16} color={colors.text} />
          <Text style={styles.editProfileButtonText}>프로필 수정</Text>
        </TouchableOpacity>

        {user?.type === "undergraduate" && (
          <TouchableOpacity
            onPress={() => router.push("/home/student-id")}
            style={styles.studentIdButton}
          >
            <Ionicons name="barcode-outline" size={16} color="#ffffff" />
            <Text style={styles.studentIdButtonText}>모바일 학생증</Text>
          </TouchableOpacity>
        )}
      </View>

      {user?.type && (
        <TouchableOpacity style={styles.infoBox}>
          {isVerifiedType && (
            <MaterialIcons name="verified" size={24} color={typeColor} />
          )}
          <View style={isVerifiedType ? styles.infoBoxTextArea : undefined}>
            <Text style={styles.infoBoxTitle}>
              {getInfoBoxTitle(user.type)}
            </Text>
            <Text style={styles.infoBoxSubtitle}>
              {getInfoBoxSubtitle(user.type)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
