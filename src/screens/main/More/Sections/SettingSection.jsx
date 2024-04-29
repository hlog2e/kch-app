import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingSection({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    wrap: { marginTop: 40 },
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
      <Text style={styles.sectionTitle}>설정</Text>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          onPress={() => navigation.push("NotificationSettingScreen")}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="notifications-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>알림 설정</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.push("VerifyUndergraduateScreen")}
          style={styles.button}
        >
          <View style={styles.buttonLeftWrap}>
            <Ionicons
              name="shield-checkmark-outline"
              size={26}
              color={colors.subText}
            />
            <Text style={styles.buttonText}>재학생 인증</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subText} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
