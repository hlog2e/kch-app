import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "../../../src/components/Banner";
import MealSection from "../../../src/components/home/MealSection";
import Header from "../../../src/components/home/Header";
import CommunitySection from "../../../src/components/home/CommunitySection";
import UpcomingEventsSection from "../../../src/components/home/UpcomingEventsSection";
import TimetableTimeline from "../../../src/components/home/TimetableTimeline";
import { useResponsiveScale } from "../../../src/hooks/useResponsiveScale";

export default function Home() {
  const { s } = useResponsiveScale();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView>
        <Header />
        <TimetableTimeline />
        <Banner location={"home"} height={s(140)} padding={s(12)} />
        <MealSection />
        <UpcomingEventsSection />
        <CommunitySection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
