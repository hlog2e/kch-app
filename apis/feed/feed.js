import { apiAuthInstance } from "../api";

export const getFeeds = async (offset) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/feed", {
    params: { limit, offset },
  });

  return data;
};
