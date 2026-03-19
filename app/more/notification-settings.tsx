import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Switch } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  getCurrentNotificaionSettings,
  postUpdateNotificationSetting,
  postUpdateCommunityNotificationSetting,
  postToggleCommunityNotification,
} from "../../apis/user/notification";
import {
  getCommunityCategories,
  CategoryItem,
} from "../../apis/community/index";
import {
  getDarkChipBg,
  getDarkChipText,
} from "../../utils/darkModeColor";
import FullScreenLoader from "../../src/components/Overlay/FullScreenLoader";
import SmallSwitch from "../../src/components/common/SmallSwitch";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SUB_ITEM_HEIGHT = 48;

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

// ─── SubCategoryItem ───
interface SubCategoryItemProps {
  category: CategoryItem;
  enabled: boolean;
  onToggle: (categoryId: string, value: boolean) => void;
}

function SubCategoryItem({ category, enabled, onToggle }: SubCategoryItemProps) {
  const { colors, dark } = useTheme();

  const badgeBg = dark ? getDarkChipBg(category.color) : category.color;
  const badgeText = dark ? getDarkChipText(category.color) : getTextColor(category.color);

  return (
    <View style={subStyles.item}>
      <View style={[subStyles.badge, { backgroundColor: badgeBg }]}>
        <Text style={[subStyles.badgeText, { color: badgeText }]}>
          {category.name}
        </Text>
      </View>
      <SmallSwitch
        value={enabled}
        onValueChange={(val) => onToggle(category.id, val)}
      />
    </View>
  );
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

const getTextColor = (bgColor: string) => {
  const rgb = hexToRgb(bgColor);
  if (!rgb) return "#4b5563";
  const { r, g, b } = rgb;

  if ((r + g + b) / 3 < 100) return "#ffffff";

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d < 15) return "#4b5563";

  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h >= 340 || h < 15) return "#dc2626";
  if (h >= 15 && h < 45) return "#ea580c";
  if (h >= 45 && h < 70) return "#d97706";
  if (h >= 70 && h < 160) return "#16a34a";
  if (h >= 160 && h < 200) return "#0891b2";
  if (h >= 200 && h < 245) return "#3b82f6";
  if (h >= 245 && h < 340) return "#7c3aed";
  return "#4b5563";
};

const subStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: SUB_ITEM_HEIGHT,
    paddingLeft: 16,
    paddingRight: 16,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

// ─── CommunityNotificationSection ───
function CommunityNotificationSection({
  currentSettings,
}: {
  currentSettings: string[];
}) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: ["communityCategories"],
    queryFn: getCommunityCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.categories ?? [];

  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set()
  );

  // 서버에서 받은 currentSettings로 초기 상태 세팅
  useEffect(() => {
    const communityIds = currentSettings
      .filter((s) => s.startsWith("community_"))
      .map((s) => s.replace("community_", ""));
    setEnabledCategories(new Set(communityIds));
    setCommunityEnabled(communityIds.length > 0);
  }, [currentSettings]);

  // Animation values
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const targetHeight = categories.length * SUB_ITEM_HEIGHT;

  useEffect(() => {
    if (communityEnabled) {
      animatedHeight.value = withTiming(targetHeight, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animatedHeight.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [communityEnabled, targetHeight, animatedHeight, opacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: opacity.value,
    overflow: "hidden" as const,
  }));

  const handleParentToggle = useCallback(
    async (value: boolean) => {
      setCommunityEnabled(value);
      if (value) {
        setEnabledCategories(new Set(categories.map((c) => c.id)));
      } else {
        setEnabledCategories(new Set());
      }
      await postToggleCommunityNotification(value);
      queryClient.invalidateQueries({ queryKey: ["NotificationSetting"] });
    },
    [categories, queryClient]
  );

  const handleSubToggle = useCallback(
    async (categoryId: string, value: boolean) => {
      setEnabledCategories((prev) => {
        const next = new Set(prev);
        if (value) {
          next.add(categoryId);
        } else {
          next.delete(categoryId);
        }

        // 마지막 서브카테고리 OFF → 부모 자동 OFF
        if (next.size === 0) {
          setCommunityEnabled(false);
        }

        return next;
      });
      await postUpdateCommunityNotificationSetting({
        categoryId,
        isRegister: value,
      });
      queryClient.invalidateQueries({ queryKey: ["NotificationSetting"] });
    },
    [queryClient]
  );

  return (
    <View>
      <Item
        id="community"
        title="커뮤니티 알림"
        desc="커뮤니티에 새로운 글이 올라오면 알려드려요!"
        value={communityEnabled}
        onPress={() => handleParentToggle(!communityEnabled)}
      />
      <Animated.View style={animatedContainerStyle}>
        {categories.map((cat) => (
          <SubCategoryItem
            key={cat.id}
            category={cat}
            enabled={enabledCategories.has(cat.id)}
            onToggle={handleSubToggle}
          />
        ))}
      </Animated.View>
    </View>
  );
}

// ─── Main Screen ───
export default function NotificationSettingScreen() {
  const queryClient = useQueryClient();
  const {
    data: currentSettings,
    isSuccess,
    isLoading,
  } = useQuery({ queryKey: ["NotificationSetting"], queryFn: getCurrentNotificaionSettings });
  const { mutate: updateSettingMutate } = useMutation({
    mutationFn: postUpdateNotificationSetting,
  });

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
              queryClient.invalidateQueries({ queryKey: ["NotificationSetting"] });
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
              queryClient.invalidateQueries({ queryKey: ["NotificationSetting"] });
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
              queryClient.invalidateQueries({ queryKey: ["NotificationSetting"] });
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
          <CommunityNotificationSection currentSettings={safeCurrentSettings ?? []} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

// ─── Item (공통) ───
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
        trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor={colors.switchTrackOff}
        onValueChange={onPress}
        value={value}
      />
    </View>
  );
}
