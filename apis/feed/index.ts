import { apiAuthInstance } from "../instance";

export const getFeeds = async (offset: number) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get<unknown>("/feed", {
    params: { limit, offset },
  });

  return data;
};

export const postFeed = async (formData: FormData) => {
  const { data } = await apiAuthInstance.post<unknown>("/feed", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const deleteFeed = async ({ feedId }: { feedId: string }) => {
  const { data } = await apiAuthInstance.post<unknown>("/feed/delete", {
    feedId: feedId,
  });

  return data;
};
