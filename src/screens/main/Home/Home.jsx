import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MealSection from "./Sections/MealSection";
import Header from "./Sections/Header";
import Banner from "../../../components/Banner";
import ButtonBar from "./Sections/ButtonBar";
import PhotoSection from "./Sections/PhotoSection";
import NoticeSection from "./Sections/NoticeSection";

export default function Home({ navigation }) {
  const styles = StyleSheet.create({
    container: { flex: 1 },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView>
        <Header navigation={navigation} />
        <Banner location={"home"} height={120} padding={14} />

        <MealSection />
        <ButtonBar navigation={navigation} />

        <PhotoSection navigation={navigation} />
        <NoticeSection navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}
