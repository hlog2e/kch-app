import { apiInstance } from "../api";

export const getNotices = async () => {
  const { data } = await apiInstance.get("/notice");
  return data;
};
