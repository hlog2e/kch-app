import { apiInstance } from "../instance";

export const getPhotos = async ({ skip }) => {
  const { data } = await apiInstance.get("/photo", {
    params: { limit: 10, skip: skip },
  });
  return data;
};
