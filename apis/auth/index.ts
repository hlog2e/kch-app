import { apiInstance } from "../instance";

export interface VerifyCodeResponse {
  // define properties based on API response shape; using any for unknown keys
  [key: string]: unknown;
}

export interface JoinRequest {
  phoneNumber: string;
  code: string;
  type: "student" | "teacher" | string;
  name: string;
  birthYear: number;
  barcode?: string;
  teacherCode?: string;
  hiddenCode?: string;
}

export const postRequestCode = async (_phoneNumber: string) => {
  const { data } = await apiInstance.post<VerifyCodeResponse>("/auth/code", {
    phoneNumber: _phoneNumber,
  });
  return data;
};

export const postVerifyCode = async (
  _phoneNumber: string,
  _verifyCode: string
) => {
  const { data } = await apiInstance.post<VerifyCodeResponse>(
    "/auth/verifyCode",
    {
      phoneNumber: _phoneNumber,
      code: _verifyCode,
    }
  );
  return data;
};

export const postJoin = async (payload: JoinRequest) => {
  const { data } = await apiInstance.post<VerifyCodeResponse>(
    "/auth/join",
    payload
  );
  return data;
};
