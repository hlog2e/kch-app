import { View, TouchableOpacity, StyleSheet } from "react-native";

import { Octicons } from "@expo/vector-icons";

export default function OnlyLeftArrowHeader({ navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Octicons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 15, marginTop: 10 },
});
