import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCurrentNotificaionSettings,
  postUpdateNotificationSetting,
} from "../../apis/user/notification";
import FullScreenLoader from "../../src/components/Overlay/FullScreenLoader";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Simple Header Component for Notification Settings
function NotificationSettingsHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 16,
      marginBottom: 6,
    },
    backButtonText: {
      paddingHorizontal: 10,
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color={colors.text} />
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function NotificationSettingScreen() {
  const queryClient = useQueryClient();
  const {
    data: currentSettings,
    isSuccess,
    isLoading,
  } = useQuery("NotificationSetting", getCurrentNotificaionSettings);
  const { mutate: updateSettingMutate } = useMutation(
    postUpdateNotificationSetting
  );

  // currentSettings를 안전하게 타입 캐스팅
  const safeCurrentSettings = currentSettings as string[] | undefined;

  const notificationSettings = [
    {
      id: "meal",
      title: "급식 알림",
      desc: "급식시간 전 메뉴를 알려드려요!",
      value: safeCurrentSettings ? safeCurrentSettings.includes("meal") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "meal",
            isRegister: !(safeCurrentSettings?.includes("meal") ?? false),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("NotificationSetting");
            },
          }
        );
      },
    },
    {
      id: "weather",
      title: "날씨 알림",
      desc: "등교전 비 소식이 있다면 알려드려요!",
      value: safeCurrentSettings
        ? safeCurrentSettings.includes("weather")
        : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "weather",
            isRegister: !(safeCurrentSettings?.includes("weather") ?? false),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("NotificationSetting");
            },
          }
        );
      },
    },
    {
      id: "feed",
      title: "피드 알림",
      desc: "피드에 새로운 글이 올라오면 알려드려요!",
      value: safeCurrentSettings ? safeCurrentSettings.includes("feed") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "feed",
            isRegister: !(safeCurrentSettings?.includes("feed") ?? false),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("NotificationSetting");
            },
          }
        );
      },
    },
  ];

  const styles = StyleSheet.create({ container: { flex: 1 } });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <NotificationSettingsHeader />

      {isLoading ? <FullScreenLoader /> : null}
      {isSuccess ? (
        <ScrollView>
          {notificationSettings.map(({ id, title, desc, value, onPress }) => {
            return (
              <Item
                key={id}
                id={id}
                title={title}
                desc={desc}
                value={value}
                onPress={onPress}
              />
            );
          })}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

interface ItemProps {
  id: string;
  title: string;
  desc: string;
  value: boolean;
  onPress: () => void;
}

function Item({ title, desc, value, onPress }: ItemProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    desc: { fontSize: 12, color: colors.subText },
  });
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onPress}
        value={value}
      />
    </View>
  );
}
