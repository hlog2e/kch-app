import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  useColorScheme,
} from "react-native";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCurrentNotificaionSettings,
  postUpdateNotificationSetting,
} from "../../../../apis/more/more";
import FullScreenLoader from "../../../components/common/FullScreenLoader";

export default function NotificationSettingScreen({ navigation }) {
  const queryClient = useQueryClient();
  const {
    data: currentSettings,
    isSuccess,
    isLoading,
  } = useQuery("NotificationSetting", getCurrentNotificaionSettings);
  const { mutate: updateSettingMutate } = useMutation(
    postUpdateNotificationSetting
  );

  const notificationSettings = [
    {
      id: "meal",
      title: "급식 알림",
      desc: "급식시간 전 메뉴를 알려드려요!",
      value: currentSettings ? currentSettings.includes("meal") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "meal",
            isRegister: !currentSettings.includes("meal"),
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
      value: currentSettings ? currentSettings.includes("weather") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "weather",
            isRegister: !currentSettings.includes("weather"),
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
      id: "newPost",
      title: "커뮤니티 알림",
      desc: "커뮤니티에 새로운 글이 올라오면 알려드려요!",
      value: currentSettings ? currentSettings.includes("newPost") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "newPost",
            isRegister: !currentSettings.includes("newPost"),
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
      <OnlyLeftArrowHeader navigation={navigation} />

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

function Item({ title, desc, value, onPress }) {
  const NowColorState = useColorScheme();
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
      color: NowColorState === "light" ? "black" : "white",
    },
    desc: { fontSize: 12, color: "gray" },
  });
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        trackColor={{ true: "#60a5fa", false: null }}
        onChange={onPress}
      />
    </View>
  );
}
