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

export const postJoin = async ({
  phoneNumber,
  code,
  type,
  name,
  birthYear,
  barcode,
  teacherCode,
}) => {
  const { data } = await apiInstance.post("/auth/join", {
    phoneNumber: phoneNumber,
    code: code,
    type: type,
    name: name,
    birthYear: birthYear,
    barcode: barcode,
    teacherCode: teacherCode,
  });
  return data;
};
