import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import { Octicons } from "@expo/vector-icons";

export default function OnlyLeftArrowHeader({ navigation, text }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Octicons name="chevron-left" size={30} color="black" />
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
