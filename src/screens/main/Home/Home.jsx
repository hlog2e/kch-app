import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import MealSection from "./Sections/MealSection";
import Header from "./Sections/Header";
import Banner from "./Sections/Banner";

export default function Home({ navigation }) {
  const styles = StyleSheet.create({
    container: { flex: 1 },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header navigation={navigation} />
        <Banner />
        <MealSection />
      </ScrollView>
    </SafeAreaView>
  );
}
