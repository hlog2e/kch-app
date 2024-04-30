import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCurrentNotificaionSettings,
  postUpdateNotificationSetting,
} from "../../../../apis/user/index";
import FullScreenLoader from "../../../components/Overlay/FullScreenLoader";
import Header from "../../../components/Header/Header";

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
      id: "feed",
      title: "피드 알림",
      desc: "피드에 새로운 글이 올라오면 알려드려요!",
      value: currentSettings ? currentSettings.includes("feed") : false,
      onPress: () => {
        updateSettingMutate(
          {
            category: "feed",
            isRegister: !currentSettings.includes("feed"),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("NotificationSetting");
            },
          }
        );
      },
    },
    // {
    //   id: "community",
    //   title: "커뮤니티 알림",
    //   desc: "커뮤니티에 새로운 글이 올라오면 알려드려요!",
    //   value: currentSettings ? currentSettings.includes("community") : false,
    //   onPress: () => {
    //     updateSettingMutate(
    //       {
    //         category: "community",
    //         isRegister: !currentSettings.includes("community"),
    //       },
    //       {
    //         onSuccess: () => {
    //           queryClient.invalidateQueries("NotificationSetting");
    //         },
    //       }
    //     );
    //   },
    // },
  ];

  const styles = StyleSheet.create({ container: { flex: 1 } });
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header navigation={navigation} />

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
        value={value}
        trackColor={{ true: "#60a5fa", false: null }}
        onChange={onPress}
      />
    </View>
  );
}
