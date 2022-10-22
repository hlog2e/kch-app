import { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiInstance } from "../../../apis/api";

export default function MealScreen() {
  useEffect(() => {
    apiInstance.get("/").then((data) => {
      console.log(data.data.message);
    });
  }, []);
  return (
    <View>
      <Text>급식</Text>
    </View>
  );
}
