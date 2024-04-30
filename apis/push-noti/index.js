import { apiAuthInstance } from "../instance";

export const registerPushTokenToDB = async (_token) => {
  const { data } = await apiAuthInstance.post("/push-noti/register", {
    token: _token,
  });
  return data;
};

export const unRegisterPushTokenToDB = async (_token) => {
  const { data } = await apiAuthInstance.post("/push-noti/unRegister", {
    token: _token,
  });
  return data;
};
