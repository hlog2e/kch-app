import { apiAuthInstance } from "../api";

export const postModifyUserInfo = async (props) => {
  const { data } = await apiAuthInstance.post("/user/modify/userInfo", {
    grade: props.grade,
    class: props.class,
    number: props.number,
  });
  return data;
};

export const getCommunitiesWrittenByMe = async () => {
  const { data } = await apiAuthInstance.get("/community/mine");

  return data;
};

export const getCurrentNotificaionSettings = async () => {
  const { data } = await apiAuthInstance.get("/user/notificationSetting");

  return data;
};

export const postUpdateNotificationSetting = async (props) => {
  const { data } = await apiAuthInstance.post("/user/notificationSetting", {
    category: props.category,
    isRegister: props.isRegister,
  });

  return data;
};

export const postResetBlockedUsers = async () => {
  const { data } = await apiAuthInstance.post("/user/reset-block-users");

  return data;
};
