import { apiInstance } from "./api";

export const postRequestCode = async (_phoneNumber, _type) => {
  const { data } = await apiInstance.post("/auth/code", {
    phoneNumber: _phoneNumber,
    type: _type,
  });
  return data;
};

export const postVerifyCode = async (_phoneNumber, _code) => {
  const { data } = await apiInstance.post("/auth/verify/code", {
    phoneNumber: _phoneNumber,
    code: _code,
  });
  return data;
};

export const postVerifyRegisterCode = async (_registerCode) => {
  const { data } = await apiInstance.post("/auth/verify/registerCode", {
    registerCode: _registerCode,
  });
  return data;
};

export const postJoinUser = async (_joinData) => {
  const { data } = await apiInstance.post("/auth/join", _joinData);
  return data;
};

export const postLogin = async (_phoneNumber, _code) => {
  const { data } = await apiInstance.post("/auth/login", {
    phoneNumber: _phoneNumber,
    code: _code,
  });
  return data;
};
