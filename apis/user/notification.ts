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

interface UpdateCommunityNotificationPayload {
  categoryId: string;
  isRegister: boolean;
}

export const postUpdateCommunityNotificationSetting = async ({
  categoryId,
  isRegister,
}: UpdateCommunityNotificationPayload) => {
  const { data } = await apiAuthInstance.post("/user/notificationSetting", {
    category: `community_${categoryId}`,
    isRegister,
  });
  return data;
};

export const postToggleCommunityNotification = async (isRegister: boolean) => {
  const { data } = await apiAuthInstance.post(
    "/user/communityNotificationSetting/toggle",
    { isRegister }
  );
  return data;
};
