import axios from "axios";

export const getWeather = async (_baseDate, _baseTime, _nx, _ny) => {
  const { data } = await axios.get(
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
    {
      params: {
        ServiceKey:
          "PcSyYRiO9daLedfPzryTETfMiNaUAh4vR0K19F/bW6dNYLseO0f0Th7f1n2vC0Qv+l3ggOwmgvQNyu6HHMoGMA==",
        dataType: "JSON",
        base_date: _baseDate,
        base_time: _baseTime,
        nx: _nx,
        ny: _ny,
      },
    }
  );

  return data;
};
