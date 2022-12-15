import { Alert, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { dfs_xy_conv, getBaseTime } from "../../../utils/korea-weather-api";
import { getWeather } from "../../../apis/home/weather";
import getLocation from "../../../utils/getLocationOnDevice";

export default function Weather() {
  const [temp, setTemp] = useState("--");
  const [rain, setRain] = useState("--");
  const [skyCode, setSkyCode] = useState(0);
  const [rainCode, setRainCode] = useState(0);

  const [isRain, setIsRain] = useState(false);
  // 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
  // 강수형태(PTY) 코드 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
  // From 기상청

  const skyIcons = [
    "",
    "sunny-outline",
    "",
    "cloud-outline",
    "cloudy-night-outline",
  ];
  const rainIcons = [
    "",
    "rainy-outline",
    "rainy-outline",
    "snow-outline",
    "rainy-outline",
  ];

  useEffect(() => {
    (async () => {
      try {
        const location = await getLocation();

        const { x, y } = dfs_xy_conv(
          "toXY",
          location.coords.latitude,
          location.coords.longitude
        );

        const { baseTime, baseDate } = getBaseTime();

        const data = await getWeather(baseDate, baseTime, x, y);
        const weatherArray = data.response.body.items.item;

        setTemp(weatherArray.find((i) => i.category === "TMP").fcstValue);
        setRain(weatherArray.find((i) => i.category === "POP").fcstValue);
        setRainCode(weatherArray.find((i) => i.category === "PTY").fcstValue);
        setSkyCode(weatherArray.find((i) => i.category === "SKY").fcstValue);

        setIsRain(
          !weatherArray.find((i) => i.category === "POP").fcstValue === "0"
            ? true
            : false
        );
      } catch (err) {
        Alert.alert(
          "날씨 오류",
          "날씨를 불러오는 도중 오류가 발생하였습니다.",
          [{ text: "확인" }]
        );
      }
    })();
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons
        name={isRain ? rainIcons[rainCode] : skyIcons[skyCode]}
        style={{}}
        size={26}
      />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{temp} ℃</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="umbrella-outline"
            style={{ color: "gray" }}
            size={12}
          />
          <Text style={{ fontSize: 12, color: "gray" }}> {rain} %</Text>
        </View>
      </View>
    </View>
  );
}
