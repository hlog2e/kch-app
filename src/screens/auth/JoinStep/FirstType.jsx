import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";

export default function FirstType({ onNext }) {
  const [type, setType] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View style={!pickerOpen && styles.flexWrap}>
      <View style={styles.wrap}>
        <Animatable.View style={styles.textWrap}>
          <Text style={styles.subTitle}>금천고 앱에 처음오셨군요!</Text>
          <Text style={styles.title}>아래에서 유형을 선택해주세요!</Text>
        </Animatable.View>
        <Animatable.View style={styles.pickerWrap}>
          <RNPickerSelect
            style={styles.picker}
            placeholder={{ label: "유형을 선택해주세요!", value: null }}
            items={[
              { label: "재학생", value: "undergraduate" },
              { label: "졸업생", value: "graduate" },
              { label: "선생님", value: "teacher" },
              { label: "학부모/외부인", value: "parents/outsider" },
            ]}
            onValueChange={(_value) => {
              setType(_value);
            }}
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

const styles = StyleSheet.create({
  flexWrap: { flex: 1, justifyContent: "space-between" },
  wrap: { marginBottom: 40 },

  textWrap: { marginTop: 32 },
  subTitle: { fontSize: 14, color: "gray" },
  title: { fontSize: 28, fontWeight: "700" },

  pickerWrap: {
    marginTop: 24,
  },
  picker: {
    inputAndroid: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
    },
    inputIOS: {
      width: "100%",
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
    },
  },

  goButton: {
    backgroundColor: "#3b82f6",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});