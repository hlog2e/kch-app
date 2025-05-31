import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { postResetBlockedUsers } from "../../../../../apis/user/index";

export default function CommunitySection({ navigation }) {
  const { colors } = useTheme();

  const { mutate: resetBlockedUsersMutate } = useMutation(
    postResetBlockedUsers
  );

  const handleResetBlockedUsers = async () => {
    const resetBlockedUser = async () => {
      await resetBlockedUsersMutate(
        {},
        {
          onSuccess: (_data) => {
            Alert.alert("알림", _data.message);
          },
        }
      );
    };

    Alert.alert("알림", "정말로 차단한 사용자를 모두 차단 해제 하시겠습니까?", [
      { text: "아니요", style: "cancel" },
      { text: "예", style: "destructive", onPress: resetBlockedUser },
    ]);
  };

  const styles = StyleSheet.create({
    wrap: { marginTop: 20 },
    sectionTitle: { fontSize: 12, color: colors.subText },

    buttonWrap: { marginTop: 12 },
    button: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    buttonLeftWrap: { flexDirection: "row", alignItems: "center" },
    buttonText: {
      fontWeight: "600",
      fontSize: 16,
      marginLeft: 10,
      color: colors.text,
    },
  });
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>커뮤니티</Text>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          onPress={() => navigation.push("CommunitiesWrittenByMeScreen")}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="file-tray-full-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>내가 작성한 글</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResetBlockedUsers}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="heart-dislike-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>차단 목록 초기화</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
