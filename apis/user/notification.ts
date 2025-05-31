import { apiAuthInstance } from "../instance";

export const getCurrentNotificaionSettings = async () => {
  const { data } = await apiAuthInstance.get<unknown>(
    "/user/notificationSetting"
  );
  return data;
};

interface UpdateNotificationPayload {
  category: string;
  isRegister: boolean;
}

export const postUpdateNotificationSetting = async ({
  category,
  isRegister,
}: UpdateNotificationPayload) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/notificationSetting",
    {
      category,
      isRegister,
    }
  );
  return data;
};
