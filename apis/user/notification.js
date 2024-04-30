import { apiAuthInstance } from "../instance";

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
