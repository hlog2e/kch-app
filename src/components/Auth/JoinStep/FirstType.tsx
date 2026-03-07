// @ts-nocheck
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@react-navigation/native";
import Dropdown from "../../common/Dropdown";

type UserType = "undergraduate" | "teacher" | "graduate" | "parents/outsider";

interface FirstTypeProps {
  onNext: (type: UserType) => void;
}

export default function FirstType({ onNext }: FirstTypeProps) {
  const { colors } = useTheme();
  const [type, setType] = useState<UserType | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const styles = StyleSheet.create({
    flexWrap: { flex: 1, justifyContent: "space-between" },
    wrap: { marginBottom: 40 },

    textWrap: { marginTop: 32 },
    subTitle: { fontSize: 14, color: (colors as any).subText },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },

    pickerWrap: {
      marginTop: 24,
      width: "100%",
    },

    goButton: {
      backgroundColor: (colors as any).blue,
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      marginBottom: 20,
    },
    buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  });

  return (
    <View style={!pickerOpen ? styles.flexWrap : undefined}>
      <View style={styles.wrap}>
        <Animatable.View style={styles.textWrap}>
          <Text style={styles.subTitle}>금천고 앱에 처음오셨군요!</Text>
          <Text style={styles.title}>아래에서 유형을 선택해주세요!</Text>
        </Animatable.View>
        <Animatable.View style={styles.pickerWrap}>
          <Dropdown
            placeholder="유형을 선택해주세요!"
            items={[
              { label: "재학생", value: "undergraduate" },
              { label: "졸업생", value: "graduate" },
              { label: "선생님", value: "teacher" },
              { label: "학부모/외부인", value: "parents/outsider" },
            ]}
            value={type}
            onValueChange={(value) => setType(value as UserType)}
            onOpen={() => setPickerOpen(true)}
            onClose={() => setPickerOpen(false)}
          />
        </Animatable.View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (type) {
            onNext(type);
          }
        }}
        style={styles.goButton}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
