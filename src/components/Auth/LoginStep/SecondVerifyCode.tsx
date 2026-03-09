import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

interface SecondVerifyCodeProps {
  phoneNumber: string;
  onNext: (code: string) => void;
  back: () => void;
  verifyStatus: VerifyStatus;
}

const CODE_LENGTH = 4;
const SUCCESS_COLOR = "#22c55e";

function DigitBox({
  digit,
  isFocused,
  index,
  verifyStatus,
}: {
  digit: string;
  isFocused: boolean;
  index: number;
  verifyStatus: VerifyStatus;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const borderColor = useSharedValue(colors.cardBg2);
  const prevDigit = useRef(digit);
  const prevVerifyStatus = useRef<VerifyStatus>("idle");

  // 숫자 입력 애니메이션: 작아졌다 커지는 팝인
  useEffect(() => {
    if (digit && digit !== prevDigit.current) {
      scale.value = 0.8;
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    prevDigit.current = digit;
  }, [digit]);

  // 포커스 border 애니메이션
  useEffect(() => {
    if (verifyStatus === "idle" || verifyStatus === "verifying") {
      borderColor.value = withTiming(
        isFocused ? colors.text : colors.cardBg2,
        { duration: 200 }
      );
    }
  }, [isFocused, verifyStatus]);

  // 검증 상태: 순차적 border 색상 전환
  useEffect(() => {
    const delay = index * 50;

    if (verifyStatus === "success" && prevVerifyStatus.current !== "success") {
      borderColor.value = withDelay(
        delay,
        withTiming(SUCCESS_COLOR, { duration: 300 })
      );
    } else if (
      verifyStatus === "error" &&
      prevVerifyStatus.current !== "error"
    ) {
      borderColor.value = withDelay(
        delay,
        withTiming(colors.red, { duration: 300 })
      );
      translateX.value = withDelay(
        delay,
        withSequence(
          withTiming(-6, { duration: 40 }),
          withTiming(6, { duration: 40 }),
          withTiming(-6, { duration: 40 }),
          withTiming(6, { duration: 40 }),
          withTiming(0, { duration: 40 })
        )
      );
    } else if (verifyStatus === "idle" && prevVerifyStatus.current !== "idle") {
      borderColor.value = withTiming(
        isFocused ? colors.text : colors.cardBg2,
        { duration: 300 }
      );
    }
    prevVerifyStatus.current = verifyStatus;
  }, [verifyStatus]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
    borderColor: borderColor.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 44,
          height: 52,
          borderRadius: 16,
          borderWidth: isFocused && verifyStatus === "idle" ? 2.5 : 2,
          backgroundColor: colors.cardBg2,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: colors.text,
        }}
      >
        {digit}
      </Text>
    </Animated.View>
  );
}

export default function SecondVerifyCode({
  phoneNumber,
  onNext,
  back,
  verifyStatus,
}: SecondVerifyCodeProps) {
  const { colors } = useTheme();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const hasSubmitted = useRef(false);

  // 자동 제출
  useEffect(() => {
    if (code.length === CODE_LENGTH && !hasSubmitted.current) {
      hasSubmitted.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onNext(code);
    }
  }, [code]);

  // 에러 시 햅틱 + 리셋
  useEffect(() => {
    if (verifyStatus === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const timer = setTimeout(() => {
        setCode("");
        hasSubmitted.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
    if (verifyStatus === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [verifyStatus]);

  const handleChangeText = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, "");
    if (filtered.length <= CODE_LENGTH) {
      setCode(filtered);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const maskedPhone = phoneNumber
    ? phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    : "";

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "space-between" },
    textWrap: { marginTop: 32 },
    subTitle: { fontSize: 14, color: colors.subText },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },
    digitRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginTop: 32,
    },
    hiddenInput: {
      position: "absolute",
      opacity: 0,
      height: 0,
      width: 0,
    },
    button: {
      width: "100%",
      height: 40,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.subText,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.textWrap}>
          <Text style={styles.subTitle}>
            {maskedPhone}으로 인증번호를 보내드렸습니다.
          </Text>
          <Text style={styles.title}>인증번호 입력해주세요!</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <Pressable onPress={focusInput} style={styles.digitRow}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <DigitBox
                key={i}
                digit={code[i] || ""}
                isFocused={
                  i === code.length && code.length < CODE_LENGTH
                }
                index={i}
                verifyStatus={verifyStatus}
              />
            ))}
          </Pressable>
        </Animated.View>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChangeText}
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          autoFocus
          style={styles.hiddenInput}
          caretHidden
        />
      </View>

      <TouchableOpacity onPress={back} style={styles.button}>
        <Text style={styles.buttonText}>이전 단계</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
