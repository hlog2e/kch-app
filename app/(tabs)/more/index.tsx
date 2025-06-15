import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderSection from "../../../src/components/more/HeaderSection";
import SettingSection from "../../../src/components/more/SettingSection";
import CommunitySection from "../../../src/components/more/CommunitySection";
import EtcSection from "../../../src/components/more/EtcSection";
import FooterSection from "../../../src/components/more/FooterSection";

export default function MoreScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scroll: { paddingHorizontal: 20 },
  });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView style={styles.scroll}>
        <HeaderSection />
        <SettingSection />
        <CommunitySection />
        <EtcSection />
        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}
