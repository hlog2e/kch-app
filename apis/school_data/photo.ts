import { apiInstance } from "../instance";

export const getPhotos = async ({ skip }: { skip: number }) => {
  const { data } = await apiInstance.get<unknown>("/photo", {
    params: { limit: 10, skip },
  });
  return data;
};
