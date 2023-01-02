import { apiAuthInstance } from "../api";

export const getCommunities = async (offset) => {
  const limit = 5;

  const { data } = await apiAuthInstance.get("/community", {
    params: { limit, offset },
  });

  return data;
};
