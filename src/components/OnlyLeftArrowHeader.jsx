import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import { Octicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function OnlyLeftArrowHeader({ navigation, text }) {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Octicons name="chevron-left" size={30} color={colors.text} />
        <Text
          style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: "600" }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 15, marginTop: 10 },
});
