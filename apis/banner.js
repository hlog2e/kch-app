import { apiInstance } from "./api";

export const getBanners = async () => {
  const { data } = await apiInstance.get("/banner");
  return data;
};
