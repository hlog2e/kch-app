import { apiAuthInstance } from "../api";

export const getUserInfo = async () => {
  const { data } = await apiAuthInstance.get("/user/info");
  return data;
};

export const postRegisterProfilePhoto = async (formData) => {
  const { data } = await apiAuthInstance.post(
    "/user/upload/profilePhoto",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const deleteProfilePhoto = async () => {
  const { data } = await apiAuthInstance.post("/user/delete/profilePhoto");

  return data;
};

export const postEditUserProfile = async ({ name, desc }) => {
  const { data } = await apiAuthInstance.post("/user/editProfile", {
    name: name,
    desc: desc,
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
