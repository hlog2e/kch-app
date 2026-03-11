import { apiAuthInstance } from "../instance";

export interface VerifyStatus {
  _id: string;
  user: string;
  type: string;
  name: string;
  birthYear: string;
  image: string;
  status: "pending" | "approved" | "rejected";
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export const postVerificationRequest = async (formData: FormData) => {
  const { data } = await apiAuthInstance.post<unknown>(
    "/user/verify",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

export const getVerifyStatus = async (): Promise<VerifyStatus | null> => {
  const { data } = await apiAuthInstance.get<VerifyStatus | null>(
    "/user/verify/status"
  );

  return data;
};
