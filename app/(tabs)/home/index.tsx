import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "../../../src/components/Banner";
import MealSection from "../../../src/components/home/MealSection";
import Header from "../../../src/components/home/Header";
import ButtonBar from "../../../src/components/home/ButtonBar";
import CommunitySection from "../../../src/components/home/CommunitySection";
import PhotoSection from "../../../src/components/home/PhotoSection";
import NoticeSection from "../../../src/components/home/NoticeSection";
import UpcomingEventsSection from "../../../src/components/home/UpcomingEventsSection";

interface HomeProps {
  navigation: any;
}

export default function Home() {
  const styles = StyleSheet.create({
    container: { flex: 1 },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView>
        <Header />
        <UpcomingEventsSection />

        <Banner location={"home"} height={90} padding={14} />

        <MealSection />

        <CommunitySection />
      </ScrollView>
    </SafeAreaView>
  );
}
