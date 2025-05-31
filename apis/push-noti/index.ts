import { apiAuthInstance } from "../instance";

export const registerPushTokenToDB = async (_token: string) => {
  const { data } = await apiAuthInstance.post<unknown>("/push-noti/register", {
    token: _token,
  });
  return data;
};

export const unRegisterPushTokenToDB = async (_token: string) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/push-noti/unRegister",
    {
      token: _token,
    }
  );
  return data;
};
