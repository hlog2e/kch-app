import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { UserContext } from "../../../../../context/UserContext";

export default function Header({ navigation }) {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerName}>3학년 김홍록님,</Text>
        <Text style={styles.headerTitle}>즐거운 오후 입니다:)</Text>
      </View>
      {user.type === "undergraduate" && (
        <TouchableOpacity
          onPress={() => {
            navigation.push("StudentIDScreen");
          }}
          style={styles.studentIdButton}
        >
          <Ionicons name="barcode-outline" size={24} color="black" />
          <Text style={styles.studentIdButtonText}>{"모바일 학생증"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 14,
    marginTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  headerName: { fontSize: 18, fontWeight: "200", color: "gray" },
  headerTitle: { fontSize: 22, fontWeight: "700", marginTop: 2 },
  studentIdButton: {
    height: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  studentIdButtonText: {
    fontSize: 10,
    marginLeft: 2,
    color: "gray",
    fontWeight: "600",
  },
});
