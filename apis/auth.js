import { apiInstance } from "./api";

export const postRequestCode = async (_phoneNumber) => {
  const { data } = await apiInstance.post("/auth/code", {
    phoneNumber: _phoneNumber,
  });
  return data;
};

export const postVerifyCode = async (_phoneNumber, _verifyCode) => {
  const { data } = await apiInstance.post("/auth/verifyCode", {
    phoneNumber: _phoneNumber,
    code: _verifyCode,
  });
  return data;
};
