import { apiInstance } from "../api";

export const getBanners = async ({ location }) => {
  console.log(location);
  const { data } = await apiInstance.get("/banner", {
    params: {
      location,
    },
  });
  return data;
};
