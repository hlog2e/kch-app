import { apiAuthInstance } from "../instance";

export const getUserInfo = async () => {
  const { data } = await apiAuthInstance.get("/user/info");
  return data;
};

export const getCommunitiesWrittenByMe = async () => {
  const { data } = await apiAuthInstance.get("/community/mine");

  return data;
};

export const postResetBlockedUsers = async () => {
  const { data } = await apiAuthInstance.post("/user/reset-block-users");

  return data;
};
