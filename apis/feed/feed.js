import { apiAuthInstance } from "../api";

export const getFeeds = async (offset) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/feed", {
    params: { limit, offset },
  });

  return data;
};

export const postFeed = async (formData) => {
  const { data } = await apiAuthInstance.post("/feed", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const deleteFeed = async ({ feedId }) => {
  const { data } = await apiAuthInstance.post("/feed/delete", {
    feedId: feedId,
  });

  return data;
};
