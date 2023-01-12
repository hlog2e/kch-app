import { apiAuthInstance } from "./api";

export const registerPushTokenToDB = async (_token) => {
  const { data } = await apiAuthInstance.post("/push-noti/register", {
    token: _token,
  });
  return data;
};
