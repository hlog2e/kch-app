import { ScrollView, StyleSheet, SafeAreaView } from "react-native";

import HeaderSection from "./Sections/HeaderSection";
import SettingSection from "./Sections/SettingSection";
import CommunitySection from "./Sections/CommunitySection";
import EtcSection from "./Sections/EtcSection";
import FooterSection from "./Sections/FooterSection";

export default function MoreScreen({ navigation }) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scroll: { paddingHorizontal: 20 },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <HeaderSection />
        <SettingSection navigation={navigation} />
        <CommunitySection navigation={navigation} />
        <EtcSection navigation={navigation} />
        <FooterSection navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}
