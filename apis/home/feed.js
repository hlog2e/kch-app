import { apiAuthInstance } from "../api";

export const getFeeds = async () => {
  const { data } = await apiAuthInstance.get("/feed", {
    params: {},
  });
  return data;
};
