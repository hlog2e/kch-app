import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import { Octicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function Header({
  navigation,
  title,
  backArrowText,
  rightComponent,
}) {
  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    title: {
      fontWeight: "700",
      fontSize: 24,
      marginTop: 14,
      marginLeft: 16,
    },
  });

  return (
    <View style={styles.header}>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <BackArrowButton
          navigation={navigation}
          backArrowText={backArrowText}
        />
      )}
      {rightComponent}
    </View>
  );
}

function BackArrowButton({ navigation, backArrowText }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16,
        marginBottom: 6,
      }}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Octicons name="chevron-left" size={30} color={colors.text} />
      <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: "600" }}>
        {backArrowText}
      </Text>
    </TouchableOpacity>
  );
}
