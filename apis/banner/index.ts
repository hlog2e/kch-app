import { apiInstance } from "../instance";

export interface Banner {
  uri: string;
  link?: string;
  location: string;
}

export const getBanners = async ({ location }: { location: string }) => {
  const { data } = await apiInstance.get<Banner[]>("/banner", {
    params: {
      location,
    },
  });
  return data;
};
