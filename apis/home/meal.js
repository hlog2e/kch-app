import { apiAuthInstance } from "../api";
import moment from "moment";

export const getMeals = async () => {
  const { data } = await apiAuthInstance.get("/meal", {
    params: { date: moment().format("YYYYMMDD"), limit: 4 },
  });
  return data;
};
