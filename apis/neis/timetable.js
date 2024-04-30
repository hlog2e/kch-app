import axios from "axios";

export const getNeisTimetable = async (
  _grade,
  _class,
  _startDate,
  _endDate
) => {
  const { data } = await axios.get("https://open.neis.go.kr/hub/hisTimetable", {
    params: {
      key: "d531f1be822747d78988989a2a35d259",
      ATPT_OFCDC_SC_CODE: "M10",
      SD_SCHUL_CODE: "8000038",
      Type: "json",
      grade: _grade,
      class_nm: _class,
      TI_FROM_YMD: _startDate,
      TI_TO_YMD: _endDate,
    },
  });

  return data;
};
