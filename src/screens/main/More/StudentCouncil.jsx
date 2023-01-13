import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlyLeftArrowHeader from "../../../components/common/OnlyLeftArrowHeader";

export default function StudentCouncilScreen({ navigation }) {
  const studentArray = [
    {
      name: ["김\n채\n윤", "이\n경\n민"],
      type: "서기부",
    },
    {
      name: ["이\n재\n형", "전\n채\n윤"],
      type: "모범생활부",
    },
    {
      name: ["이\n유\n정", "손\n채\n령"],
      type: "진로탐색부",
    },
    {
      name: ["김\n홍\n록", "길\n채\n빈"],
      type: "미디어홍보부",
    },
    {
      name: ["공\n \n석", "곽\n서\n은"],
      type: "예능기획부",
    },
    {
      name: ["전\n영\n선", "도\n경\n민"],
      type: "글로벌민주사회부",
    },
    {
      name: ["이\n연\n수", "김\n상\n운"],
      type: "자연융합과학부",
    },
    {
      name: ["노\n해\n랑", "서\n경\n진"],
      type: "생태환경봉사부",
    },
    {
      name: ["이\n언\n군", "박\n현\n준"],
      type: "체육인성부",
    },
    {
      name: ["김\n수\n현", "김\n지\n호"],
      type: "사제동행부",
    },
    {
      name: ["임\n혜\n주", "이\n현\n아"],
      type: "학생소통부",
    },
  ];

  const styles = StyleSheet.create({
    section1: { marginTop: 30 },
    center_row: {
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "center",
    },
    between_row: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },
    leader_item: {
      height: 80,
      width: 100,
      borderRadius: 10,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 18,
    },
    leader_title: {
      fontSize: 13,
      fontWeight: "700",
      color: "gray",
    },
    leader_text: {
      fontSize: 20,
      fontWeight: "700",
    },
    student_row: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginTop: 26,
    },
  });
  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView>
        <OnlyLeftArrowHeader navigation={navigation} />
        <View style={styles.section1}>
          <View style={styles.center_row}>
            <View style={styles.leader_item}>
              <Text style={styles.leader_title}>학생 회장</Text>
              <Text style={styles.leader_text}>함윤서</Text>
            </View>
          </View>
          <View style={styles.between_row}>
            <View style={styles.leader_item}>
              <Text style={styles.leader_title}>학생 부회장</Text>
              <Text style={styles.leader_text}>심유신</Text>
            </View>
            <View style={styles.leader_item}>
              <Text style={styles.leader_title}>학생 부회장</Text>
              <Text style={styles.leader_text}>김나은</Text>
            </View>
            <View style={styles.leader_item}>
              <Text style={styles.leader_title}>학생 부회장</Text>
              <Text style={styles.leader_text}>김가윤</Text>
            </View>
          </View>
          <View style={styles.student_row}>
            {studentArray.map(({ name, type }) => {
              return (
                <StudentItem
                  key={String(name + type)}
                  name={name}
                  type={type}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StudentItem({ name, type }) {
  const styles = StyleSheet.create({
    student_item: {
      width: 80,
      height: 110,
      marginHorizontal: 5,
      marginVertical: 10,
      backgroundColor: "white",
      borderRadius: 10,
      paddingVertical: 10,
    },
    student_item_title: {
      fontSize: 11,
      fontWeight: "700",
      color: "#60a5fa",
    },
    student_header: { alignItems: "center" },
    student_type_row: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    student_type: {
      fontSize: 12,
      fontWeight: "700",
      color: "gray",
    },
    student_name_row: {
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    student_name: {
      fontSize: 15,
      fontWeight: "700",
    },
  });
  return (
    <View style={styles.student_item}>
      <View style={styles.student_header}>
        <Text style={styles.student_item_title}>{type}</Text>
      </View>

      <View style={styles.student_type_row}>
        <Text style={styles.student_type}>부장</Text>
        <Text style={styles.student_type}>차장</Text>
      </View>
      <View style={styles.student_name_row}>
        <Text style={styles.student_name}>{name[0]}</Text>
        <Text style={styles.student_name}>{name[1]}</Text>
      </View>
    </View>
  );
}
