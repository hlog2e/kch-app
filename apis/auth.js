import { apiInstance } from "./api";

export const requestVerifyCode = async (_phoneNumber) => {
  return await apiInstance.post("/auth/code", {
    phoneNumber: _phoneNumber,
  });
};
