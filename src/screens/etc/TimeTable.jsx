import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getTimetable } from "../../../apis/home/timetable";
import moment from "moment/moment";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TimetableScreen() {
  const [timetable, setTimetable] = useState();
  const weekFirstDay = moment() //이번주 월요일날짜
    .startOf("weeks")
    .add(1, "days")
    .format("YYYYMMDD");

  const dateArray = [
    weekFirstDay,
    moment(weekFirstDay).add(1, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(2, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(3, "days").format("YYYYMMDD"),
    moment(weekFirstDay).add(4, "days").format("YYYYMMDD"),
  ];

  async function getTimetableAndSort() {
    const data = await getTimetable("2", "5", "20221031", "20221104");

    const row = data.hisTimetable[1].row;
    const _timetable = row.reduce((acc, e) => {
      if (!acc[e.ALL_TI_YMD]) acc[e.ALL_TI_YMD] = [];
      acc[e.ALL_TI_YMD].push(e);

      return acc;
    }, {});

    console.log(_timetable[dateArray[1]][0].ITRT_CNTNT);
    setTimetable(_timetable);
  }

  useEffect(() => {
    getTimetableAndSort();
  }, []);

  return (
    <SafeAreaView>
      <Text>{timetable[dateArray[1]][0].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][1].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][2].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][3].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][4].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][5].ITRT_CNTNT}</Text>
      <Text>{timetable[dateArray[1]][6].ITRT_CNTNT}</Text>
    </SafeAreaView>
  );
}
