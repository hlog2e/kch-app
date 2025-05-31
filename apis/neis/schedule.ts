import axios from "axios";

export const getSchedule = async (_startDate: string, _endDate: string) => {
  const { data } = await axios.get<unknown>(
    "https://open.neis.go.kr/hub/SchoolSchedule",
    {
      params: {
        key: "d531f1be822747d78988989a2a35d259",
        ATPT_OFCDC_SC_CODE: "M10",
        SD_SCHUL_CODE: "8000038",
        Type: "json",
        AA_FROM_YMD: _startDate,
        AA_TO_YMD: _endDate,
      },
    }
  );

  return data;
};
