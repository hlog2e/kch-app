import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/ko";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

import { comma } from "../../../../utils/intl";
import HorizontalScrollImageView from "../../Image/HorizontalScrollImageView";
import CommunityBadge from "../CommunityBadge";

interface CommunityItemProps {
  item: {
    _id: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    category?: string;
    publisher: {
      name: string;
      desc: string;
    };
    createdAt: string;
    images: string[];
    likeCount: number;
    commentCount: number;
    views: any[];
  };
}

export default function CommunityItem({ item }: CommunityItemProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginBottom: 8,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    headerSection: {
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    nameAndTime: { fontSize: 11, color: "#b4b4b4", marginTop: 2 },
    content: {
      fontSize: 14,
      color: colors.subText,
      marginTop: 18,
      maxHeight: 40,
    },
    footer: {
      flexDirection: "row",
      marginTop: 8,
    },
    icon_wrap: { flexDirection: "row", alignItems: "center" },
    icon_text: { fontSize: 12, marginLeft: 6, color: "#b4b4b4" },
  });

  const handlePress = () => {
    router.push({
      pathname: "/community/detail",
      params: { id: item._id },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View>
        <View style={styles.headerSection}>
          <CommunityBadge categoryId={item.category} size="small" />
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.nameAndTime}>
          {item.isAnonymous
            ? "익명"
            : !item?.publisher || !item?.publisher?.name
            ? "탈퇴한 사용자"
            : item?.publisher?.name +
              (item?.publisher?.desc ? ` (${item?.publisher?.desc})` : "")}{" "}
          | {moment(item.createdAt).fromNow()}
        </Text>
      </View>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>
        {item.content}
      </Text>
      {item.images.length > 0 ? (
        <HorizontalScrollImageView data={item.images} />
      ) : null}

      <View style={styles.footer}>
        <View style={styles.icon_wrap}>
          <FontAwesome name={"heart-o"} size={20} color={colors.text} />
          <Text style={styles.icon_text}>{comma(item.likeCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"chatbubble-outline"} size={20} color={colors.text} />
          <Text style={styles.icon_text}>{comma(item.commentCount)}</Text>
        </View>
        <View style={[styles.icon_wrap, { marginLeft: 14 }]}>
          <Ionicons name={"eye-outline"} size={24} color={colors.text} />
          <Text style={styles.icon_text}>
            {item.views ? comma(item.views.length) : 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
