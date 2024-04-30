import { apiInstance } from "../instance";

export const getBanners = async ({ location }) => {
  const { data } = await apiInstance.get("/banner", {
    params: {
      location,
    },
  });
  return data;
};
